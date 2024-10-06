# set_state AND set_run MUST BE CALLED
def start(set_state, set_run, register_button, args, ex):
    set_run(PROC_RUN_DOWNTIME, 1000)

# set_run MUST BE CALLED
def loop(state, set_run, ex):
    set_run(PROC_RUN_DOWNTIME, 1000)

def stop(state, ex):
    pass

register_meta("DESCRIPTION", ["DOMAIN 1", "DOMAIN 2", "DOMAIN 3..."])
register_ex("Test Ex")
register_color_arg("Color", 255, 255, 255)
register_select_arg("Select", ["Value 1", "Value 2"], "Value 1")
register_start(start)
register_loop(loop)
register_stop(stop)
