import pathlib
from extension_handler import start_extensions, flush_extensions, get_procedure_extensions
from schema import LightsProcedureColorArg, SchemaStartProcedureSelectArg, SchemaStartProcedureColorArg, LightsProcedureColorArgDefault, LightsProcedureSelectArg, get_lights_procedure_color_arg_type, get_lights_procedure_select_arg_type, SchemaButton, VariableWrapper

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from lights_global_state import LightsGlobalState

DEFAULT_PROCEDURE_TEXT = \
"""# STATE MUST BE RETURNED
def start(internal_exit, register_button, args, ex):
    return None

def stop(state, ex):
    pass

register_meta("DESCRIPTION", ["DOMAIN 1", "DOMAIN 2", "DOMAIN 3..."])
register_color_arg("Color", 255, 255, 255)
register_select_arg("Select", ["Value 1", "Value 2"], "Value 1")
register_start(start)
register_stop(stop)"""

class LightsProcedure:
    def __init__(self, name, desc, domains, ex, start_fn, stop_fn, args, link):
        self.name = name
        self.desc = desc
        self.domains = domains
        self.ex = ex
        self.start_fn = start_fn
        self.stop_fn = stop_fn
        self.args = args
        self.link = link

class LightsRunningProcedure:
    def __init__(self, proc, state, buttons):
        self.proc = proc
        self.state = state
        self.buttons = buttons

class LightsProcedureBuilder:
    def __init__(self):
        self.name = None
        self.desc = None
        self.domains = None
        self.ex = []
        self.start_fn = None
        self.stop_fn = None
        self.args = []

    def register_meta(self, desc, domains):
        self.desc = desc
        self.domains = domains

    def register_ex(self, ex_name):
        self.ex.append(ex_name)

    def register_start(self, start_fn):
        self.start_fn = start_fn

    def register_stop(self, stop_fn):
        self.stop_fn = stop_fn

    def register_color_arg(self, arg_name, arg_color_r, arg_color_g, arg_color_b):
        arg = LightsProcedureColorArg(type=get_lights_procedure_color_arg_type(), text=arg_name, default=LightsProcedureColorArgDefault(r=arg_color_r, g=arg_color_g, b=arg_color_b))
        self.args.append(arg)

    def register_select_arg(self, arg_name, arg_select_options, arg_select_def):
        arg = LightsProcedureSelectArg(type=get_lights_procedure_select_arg_type(), text=arg_name, options=arg_select_options, default=arg_select_def)
        self.args.append(arg)

    def compile(self, name):
        self.name = name

        if self.name == None or self.desc == None or self.domains == None or self.start_fn == None or self.stop_fn == None:
            raise RuntimeError()
        
        return self

    def build(self, link):
        proc = LightsProcedure(self.name, self.desc, self.domains, self.ex, self.start_fn, self.stop_fn, self.args, link)
        return proc

def stop_procedure(glo: "LightsGlobalState", act_proc: LightsRunningProcedure):
    act_proc.proc.stop_fn(act_proc.state, get_procedure_extensions(glo, act_proc.proc))

    glo.running_proc.remove(act_proc)
    flush_extensions(glo)

def start_procedure(glo: "LightsGlobalState", proc: LightsProcedure, args: list[SchemaStartProcedureColorArg | SchemaStartProcedureSelectArg]):
    domains_comp = []

    for key in glo.running_proc:
        domains_comp.extend(key.proc.domains)

    if(any([proc_domain in domains_comp for proc_domain in proc.domains])):
        raise RuntimeError()
    
    start_extensions(glo, proc)

    proc_buttons = []
    premature_exit = VariableWrapper(False)
    out_proc = VariableWrapper(None)

    def proc_register_button(text, on_click_body, confirm_nullable):
        proc_buttons.append(SchemaButton(text=text, on_click_body=on_click_body, confirm_nullable=confirm_nullable))
    
    def proc_internal_exit():
        if out_proc.var != None:
            stop_procedure(glo, out_proc.var)
            return
        
        premature_exit.var = True

    out_state = proc.start_fn(proc_internal_exit, proc_register_button, args, get_procedure_extensions(glo, proc))
    out_proc.var = LightsRunningProcedure(proc, out_state, proc_buttons)

    glo.running_proc.append(out_proc.var)
    
    if premature_exit.var == True:
        stop_procedure(glo, out_proc.var)

def delete_procedure(glo: "LightsGlobalState", proc: LightsProcedure):
    glo.procedures.remove(proc)

    proc.link.unlink()

def write_procedure(name: str, text: str):
    link = pathlib.Path(__file__).parent.joinpath("procedures").joinpath(f"{name}.py")

    with open(link, "wb") as stream:
        stream.write(text.encode("utf-8"))

    return link

def load_procedure(glo: "LightsGlobalState", builder: LightsProcedureBuilder, link: pathlib.Path):
    proc = builder.build(link)
    glo.procedures.append(proc)

def read_procedure(text: str):
    builder = LightsProcedureBuilder()

    def scope_exec():
        exec(text, {
            "register_meta": builder.register_meta,
            "register_ex": builder.register_ex,
            "register_start": builder.register_start,
            "register_stop": builder.register_stop,
            "register_color_arg": builder.register_color_arg,
            "register_select_arg": builder.register_select_arg,
        })

    scope_exec()

    return builder

def init_procedures() -> list[LightsProcedure]:
    files = pathlib.Path(__file__).parent.joinpath("procedures").glob("*.py")
    files = [f for f in files if f.is_file()]

    out = []

    for file in files:

        file_text = ""
        with open(file, "r") as stream:
            file_text = stream.read()

        try:
            proc = read_procedure(file_text).compile(file.stem).build(file)
            out.append(proc)
            print(f"Loaded Procedure: {proc.name}")
        except Exception as e:
            print(e)
    
    return out
