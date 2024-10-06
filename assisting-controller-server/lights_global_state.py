import threading
from extension_handler import init_extensions, LightsExtensionLoopEvent, get_procedure_extensions, EX_RUN_DOWNTIME, EX_RUN_SUSPEND
from procedure_handler import init_procedures, LightsProcedureLoopEvent, PROC_RUN_DOWNTIME, PROC_RUN_QUIT, PROC_RUN_SUSPEND, stop_procedure
from qt_sync import SyncWaiter

class LightsGlobalState:
    def __init__(self):
        self.procedures = init_procedures()
        self.extensions = init_extensions()

        self.running_proc = []
        self.running_ex = []

        self.loop = SyncWaiter()

        self.background_thread = threading.Thread(target=self.background)
        self.background_thread.start()

    def background(self):
        while True:
            ev = self.loop.wait_var()
            if(self.loop.has_quit()):
                break

            self.handle(ev)

    def handle(self, ev):

        if(isinstance(ev, LightsProcedureLoopEvent)):
            proc_run = []
            
            def proc_set_run(*args):
                proc_run.extend(args)

            ev.act_proc.proc.loop_fn(ev.act_proc.state, proc_set_run, get_procedure_extensions(self, ev.act_proc.proc))
            
            if len(proc_run) > 0:
                if(proc_run[0] == PROC_RUN_QUIT):
                    stop_procedure(ev.act_proc)
                    return

                if(proc_run[0] == PROC_RUN_DOWNTIME):
                    self.loop.set_downtime(LightsProcedureLoopEvent(ev.act_proc), proc_run[1])
                    return

                if(proc_run[0] == PROC_RUN_SUSPEND):
                    return

            return
    
        if(isinstance(ev, LightsExtensionLoopEvent)):
            ex_run = []
            
            def ex_set_run(*args):
                ex_run.extend(args)

            ev.act_ex.loop_fn(ev.act_ex.state, ex_set_run)
            
            if len(ex_run) > 0:
                if(ex_run[0] == EX_RUN_DOWNTIME):
                    self.loop.set_downtime(LightsExtensionLoopEvent(ev.act_ex), ex_run[1])
                    return

                if(ex_run[0] == EX_RUN_SUSPEND):
                    return
                
            return