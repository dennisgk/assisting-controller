from typing import Any
from pydantic import BaseModel
import pathlib

class SchemaExtension(BaseModel):
    name: str

class SchemaProcedure(BaseModel):
    name: str
    info: list[str]

class SchemaButton(BaseModel):
    text: str
    on_click_body: str
    confirm_nullable: str | None

class SchemaRunning(BaseModel):
    name: str
    buttons: list[SchemaButton]

def get_lights_procedure_select_arg_type():
    return "SELECT_OPTION"

def get_lights_procedure_color_arg_type():
    return "COLOR_OPTION"

class LightsProcedureSelectArg(BaseModel):
    type: str
    text: str
    options: list[str]
    default: str

class LightsProcedureColorArgDefault(BaseModel):
    r: int
    g: int
    b: int

class LightsProcedureColorArg(BaseModel):
    type: str
    text: str
    default: LightsProcedureColorArgDefault

class SchemaStartProcedureColorArg(BaseModel):
    type: str
    text: str
    value: LightsProcedureColorArgDefault

class SchemaStartProcedureSelectArg(BaseModel):
    type: str
    text: str
    value: str

class SchemaStartProcedure(BaseModel):
    name: str
    args: list[SchemaStartProcedureColorArg | SchemaStartProcedureSelectArg]

class SchemaEdit(BaseModel):
    name: str
    text: str

class VariableWrapper():
    def __init__(self, var):
        self.var = var

class SchemaInterop():
    def __init__(self):
        self.admin_restart = None
        self.admin_shutdown = None
        self.admin_update = None
        self.admin_logs = None
        self.on_start = None
    
    def register_admin_restart(self, fn):
        self.admin_restart = fn
    
    def register_admin_shutdown(self, fn):
        self.admin_shutdown = fn
    
    def register_admin_update(self, fn):
        self.admin_update = fn
    
    def register_admin_logs(self, fn):
        self.admin_logs = fn
    
    def register_on_start(self, fn):
        self.on_start = fn

def init_interop():
    file = pathlib.Path(__file__).parent.parent.joinpath("assisting-controller-init").joinpath("config.py")
    
    with open(file, "r") as stream:
        text = stream.read()

    builder = SchemaInterop()

    def scope_exec():
        exec(text, {
            "register_admin_restart": builder.register_admin_restart,
            "register_admin_shutdown": builder.register_admin_shutdown,
            "register_admin_update": builder.register_admin_update,
            "register_admin_logs": builder.register_admin_logs,
            "register_on_start": builder.register_on_start,
        })

    scope_exec()

    return builder