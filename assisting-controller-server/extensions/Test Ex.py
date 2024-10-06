# set_state AND set_run MUST BE CALLED
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
