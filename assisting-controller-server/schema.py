from pydantic import BaseModel

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