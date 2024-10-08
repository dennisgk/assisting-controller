import pathlib
from schema import VariableWrapper, FunctionWrapper

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from procedure_handler import LightsRunningProcedure, LightsProcedure
    from lights_global_state import LightsGlobalState

EX_RUN_DOWNTIME = "EX_RUN_DOWNTIME"
EX_RUN_SUSPEND = "EX_RUN_SUSPEND"

DEFAULT_EXTENSION_TEXT = \
"""# set_state AND set_run MUST BE CALLED
def start(set_state, set_run):
    pass

# set_run MUST BE CALLED
def loop(state, set_run):
    pass
    
def stop(state):
    pass

register_start(start)
register_loop(loop)
register_stop(stop)
"""

class LightsExtension:
    def __init__(self, name, start_fn, loop_fn, stop_fn, link):
        self.name = name
        self.start_fn = start_fn
        self.loop_fn = loop_fn
        self.stop_fn = stop_fn
        self.link = link

class LightsExtensionLoopEvent:
    def __init__(self, act_ex):
        self.act_ex = act_ex

class LightsRunningExtension:
    def __init__(self, ex, state):
        self.ex = ex
        self.state = state

class LightsExtensionBuilder:
    def __init__(self):
        self.name = None
        self.start_fn = None
        self.loop_fn = None
        self.stop_fn = None

    def register_start(self, start_fn):
        self.start_fn = start_fn

    def register_loop(self, loop_fn):
        self.loop_fn = loop_fn

    def register_stop(self, stop_fn):
        self.stop_fn = stop_fn

    def compile(self, name):
        self.name = name

        if self.name == None or self.start_fn == None or self.loop_fn == None or self.stop_fn == None:
            raise RuntimeError()
        
        return self
    
    def build(self, link):
        ex = LightsExtension(self.name, self.start_fn, self.loop_fn, self.stop_fn, link)
        return ex
    
def start_extensions(glo: "LightsGlobalState", proc: "LightsProcedure"):
    for ex in [ex for ex in glo.extensions if ex.name in proc.ex]:
        if(ex in [act.ex for act in glo.running_ex]):
            continue
        
        out_state = VariableWrapper(None)
        out_suspend_fn = VariableWrapper(None)
        ex_run = []

        def ex_set_state(state):
            out_state.var = state
        
        def ex_set_run(*args):
            ex_run.extend(args)
            if args[0] == EX_RUN_SUSPEND:
                out_suspend_fn.var = FunctionWrapper()
                return out_suspend_fn.var

        ex.start_fn(ex_set_state, ex_set_run)
        out_ex = LightsRunningExtension(ex, out_state.var)
        glo.running_ex.append(out_ex)

        if len(ex_run) > 0:
            if(ex_run[0] == EX_RUN_DOWNTIME):
                glo.loop.set_downtime(LightsExtensionLoopEvent(out_ex), ex_run[1])

            if(ex_run[0] == EX_RUN_SUSPEND):
                def unsuspend_ex(time_arg):
                    glo.loop.set_downtime(LightsExtensionLoopEvent(out_ex), time_arg)
                
                out_suspend_fn.var.fn = unsuspend_ex

def flush_extensions(glo: "LightsGlobalState"):
    needed_ex = list(set(sum([act.proc.ex for act in glo.running_proc], [])))

    for act in [act for act in glo.running_ex if act.ex.name not in needed_ex]:
        
        glo.loop.remove_where(lambda x: isinstance(x, LightsExtensionLoopEvent) and x.act_ex == act)

        act.ex.stop_fn(act.state)
        glo.running_ex.remove(act)

def get_procedure_extensions(glo: "LightsGlobalState", proc: "LightsProcedure"):
    ret = {}

    for act in [act for act in glo.running_ex if act.ex.name in proc.ex]:
        ret[act.ex.name] = act.state

    return ret
        
def delete_extension(glo: "LightsGlobalState", ex: LightsExtension):
    glo.extensions.remove(ex)

    ex.link.unlink()

def write_extension(name: str, text: str):
    link = pathlib.Path(__file__).parent.joinpath("extensions").joinpath(f"{name}.py")

    with open(link, "wb") as stream:
        stream.write(text.encode("utf-8"))

    return link

def load_extension(glo: "LightsGlobalState", builder: LightsExtensionBuilder, link: pathlib.Path):
    proc = builder.build(link)
    glo.extensions.append(proc)

def read_extension(text: str):
    builder = LightsExtensionBuilder()

    def scope_exec():
        exec(text, {
            "register_start": builder.register_start,
            "register_loop": builder.register_loop,
            "register_stop": builder.register_stop,
            "EX_RUN_DOWNTIME": EX_RUN_DOWNTIME,
            "EX_RUN_SUSPEND": EX_RUN_SUSPEND,
        })

    scope_exec()

    return builder

def init_extensions() -> list[LightsExtension]:
    files = pathlib.Path(__file__).parent.joinpath("extensions").glob("*.py")
    files = [f for f in files if f.is_file()]

    out = []

    for file in files:

        file_text = ""
        with open(file, "r") as stream:
            file_text = stream.read()

        try:
            ex = read_extension(file_text).compile(file.stem).build(file)
            out.append(ex)
            print(f"Loaded Extension: {ex.name}")
        except Exception as e:
            print(e)

    return out
