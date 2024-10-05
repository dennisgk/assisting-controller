import threading
from datetime import datetime

class SyncWaiter():
    def __init__(self):
        self.start_time = datetime.now()

        self.quit_event = threading.Event()

        self.var = []
        self.var_mutex = threading.Lock()
        self.var_event = threading.Event()

        self.downtime_var = []
        self.downtime_var_mutex = threading.Lock()
        self.downtime_var_event = threading.Event()

        self.downtime_thread = threading.Thread(target = self.downtime_waiter)
        self.downtime_thread.start()

    def has_quit(self):
        return self.quit_event.is_set()
        
    def wait_var(self):
        if(self.has_quit()):
            return None

        self.var_mutex.acquire()
        if(len(self.var) > 0):
            ret_val = self.var[0]
            self.var.pop(0)
            self.var_mutex.release()
            return ret_val
        
        self.var_mutex.release()

        self.var_event.wait()
        if(self.has_quit()):
            return None
        
        self.var_mutex.acquire()
        ret_val = self.var[0]
        self.var.pop(0)
        self.var_mutex.release()
        
        return ret_val

    def remove_where(self, where_callback):
        self.downtime_var_mutex.acquire()
        self.var_mutex.acquire()

        rem_var_list = []
        rem_downtime_var_list = []

        for x in range(0, len(self.var)):
            if(where_callback(self.var[x])):
                rem_var_list.append(self.var[x])

        for x in range(0, len(self.downtime_var)):
            if(where_callback(self.downtime_var[x][1])):
                rem_downtime_var_list.append(self.downtime_var[x])

        for x in rem_var_list:
            self.var.remove(x)

        for x in rem_downtime_var_list:
            self.downtime_var.remove(x)

        self.var_mutex.release()
        self.downtime_var_mutex.release()

    def set(self, v):
        if(self.has_quit()):
            return

        self.var_mutex.acquire()
        self.var.append(v)
        self.var_mutex.release()
        self.var_event.set()
        self.var_event.clear()

    def set_downtime(self, v, millis):
        if(self.has_quit()):
            return
        
        self.downtime_var_mutex.acquire()

        val_insert = (self.elapsed_millis() + millis, v)
        was_inserted = False
        for x in range(0, len(self.downtime_var)):
            if(val_insert[0] < self.downtime_var[x][0]):
                self.downtime_var.insert(x, val_insert)
                was_inserted = True
                break

        if(not was_inserted):
            self.downtime_var.append(val_insert)
        
        self.downtime_var_mutex.release()
        self.downtime_var_event.set()
        self.downtime_var_event.clear()

    def elapsed_millis(self):
        dt = datetime.now() - self.start_time
        ms = (dt.days * 24 * 60 * 60 + dt.seconds) * 1000 + dt.microseconds / 1000.0
        return ms

    def quit(self):
        self.quit_event.set()

        self.var_event.set()
        self.var_event.clear()
        self.downtime_var_event.set()
        self.downtime_var_event.clear()

    def downtime_next_millis(self):
        self.downtime_var_mutex.acquire()

        timeout_millis = None
        if(len(self.downtime_var) > 0):
            timeout_millis = self.downtime_var[0][0] - self.elapsed_millis()
        
        self.downtime_var_mutex.release()

        return timeout_millis

    def downtime_waiter(self):

        while True:
            if(self.has_quit()):
                break

            timeout_millis = self.downtime_next_millis()

            while(timeout_millis == None):
                self.downtime_var_event.wait()
                if(self.has_quit()):
                    break

                timeout_millis = self.downtime_next_millis()
            
            if(timeout_millis != None and timeout_millis > 0):
                self.downtime_var_event.wait(timeout_millis * 0.001)
                if(self.has_quit()):
                    break

            self.downtime_var_mutex.acquire()

            del_ordered_index = len(self.downtime_var)

            for x in range(0, len(self.downtime_var)):
                if(self.elapsed_millis() >= self.downtime_var[x][0]):
                    self.set(self.downtime_var[x][1])
                else:
                    del_ordered_index = x
                    break

            for x in range(0, del_ordered_index):
                self.downtime_var.pop(0)

            self.downtime_var_mutex.release()