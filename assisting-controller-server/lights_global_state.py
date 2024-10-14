import threading
from extension_handler import init_extensions
from procedure_handler import init_procedures
from schema import init_interop

class LightsGlobalState:
    def __init__(self):
        self.procedures = init_procedures()
        self.extensions = init_extensions()

        self.running_proc = []
        self.running_ex = []

        self.interop = init_interop()