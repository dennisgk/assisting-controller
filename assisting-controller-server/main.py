from fastapi import FastAPI, HTTPException, status
from fastapi.responses import FileResponse, JSONResponse, PlainTextResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.encoders import jsonable_encoder
import uvicorn
import pathlib
import traceback

import uvicorn.config
from lights_global_state import LightsGlobalState
from schema import SchemaExtension, SchemaButton, SchemaProcedure, SchemaRunning, SchemaStartProcedure, SchemaEdit
from procedure_handler import start_procedure, stop_procedure, delete_procedure, write_procedure, load_procedure, read_procedure, DEFAULT_PROCEDURE_TEXT
from extension_handler import delete_extension, write_extension, load_extension, read_extension, DEFAULT_EXTENSION_TEXT
import os

if os.name != "nt":
    import time
    time.sleep(10)

app = FastAPI()
glo = LightsGlobalState()

app.mount("/assets", StaticFiles(directory=pathlib.Path(__file__).parent.parent.joinpath("assisting-controller-react").joinpath("dist").joinpath("assets").resolve()), name="assets")

def index():
    return FileResponse(path=pathlib.Path(__file__).parent.parent.joinpath("assisting-controller-react").joinpath("dist").joinpath("index.html").resolve())

@app.get("/", response_class=FileResponse)
def get():
    return index()

@app.get("/proc", response_class=FileResponse)
def get_proc():
    return index()

@app.get("/settings", response_class=FileResponse)
def get_settings():
    return index()

@app.get("/run", response_class=FileResponse)
def get_run():
    return index()

@app.get("/edit/procedure", response_class=FileResponse)
def get_edit_procedure():
    return index()

@app.get("/edit/extension", response_class=FileResponse)
def get_edit_extension():
    return index()

@app.get("/icon.svg", response_class=FileResponse)
def get_icon():
    return FileResponse(path=pathlib.Path(__file__).parent.parent.joinpath("assisting-controller-react").joinpath("dist").joinpath("icon.svg").resolve())

@app.get("/api/get_extensions", response_class=JSONResponse)
def get_api_get_extensions():
    return JSONResponse(content=jsonable_encoder(obj=[SchemaExtension(name=x.name) for x in glo.extensions]))

@app.get("/api/get_procedures", response_class=JSONResponse)
def get_api_get_procedures():
    return JSONResponse(content=jsonable_encoder(obj=[SchemaProcedure(name=x.name, info=[f"Description: {x.desc}", f"Domains: {", ".join(x.domains)}"]) for x in glo.procedures]))

@app.get("/api/get_running", response_class=JSONResponse)
def get_api_get_running():    
    return JSONResponse(content=jsonable_encoder(obj=[SchemaRunning(name=x.proc.name, buttons=x.buttons) for x in glo.running_proc]))

@app.get("/api/get_admin", response_class=JSONResponse)
def get_api_get_admin():
    return JSONResponse(content=jsonable_encoder(obj=[SchemaButton(text="Reboot", on_click_body="async function restart(){await fetch(\"/api/admin_restart\");};window.AC_QUEUE(restart);", confirm_nullable="Are you sure you want to reboot?")]))

@app.get("/api/get_extension_text", response_class=PlainTextResponse)
def get_api_get_extension_text(name: str):
    desc = [x for x in glo.extensions if x.name == name]
    
    if len(desc) == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    with open(desc[0].link, "r") as stream:
        file_text = stream.read()

    return PlainTextResponse(content=file_text)

@app.get("/api/get_procedure_text", response_class=PlainTextResponse)
def get_api_get_procedure_text(name: str):
    desc = [x for x in glo.procedures if x.name == name]
    
    if len(desc) == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    with open(desc[0].link, "r") as stream:
        file_text = stream.read()

    return PlainTextResponse(content=file_text)

@app.get("/api/get_procedure_start_args", response_class=JSONResponse)
def get_api_get_procedure_start_args(name: str):
    desc = [x for x in glo.procedures if x.name == name]

    if len(desc) == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    return JSONResponse(content=jsonable_encoder(obj=desc[0].args))

@app.post("/api/start_procedure", response_class=Response)
def post_api_start_procedure(body: SchemaStartProcedure):
    desc = [x for x in glo.procedures if x.name == body.name]

    if len(desc) == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    try:
        start_procedure(glo, desc[0], body.args)
    except Exception as inst:
        print(inst)
        print(traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(status_code=status.HTTP_200_OK)

@app.get("/api/stop_procedure", response_class=Response)
def get_api_stop_procedure(name: str):
    desc = [x for x in glo.running_proc if x.proc.name == name]

    if len(desc) == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    try:
        stop_procedure(glo, desc[0])
    except Exception as inst:
        print(inst)
        print(traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(status_code=status.HTTP_200_OK)
    
@app.post("/api/edit_procedure", response_class=Response)
def post_api_edit_procedure(body: SchemaEdit):
    if len([act for act in glo.running_proc if act.proc.name == body.name]) != 0:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    desc = [x for x in glo.procedures if x.name == body.name]

    if len(desc) == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    try:
        builder = read_procedure(body.text).compile(body.name)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    
    delete_procedure(glo, desc[0])
    link = write_procedure(builder.name, body.text)
    load_procedure(glo, builder, link)
    
    return Response(status_code=status.HTTP_200_OK)

@app.post("/api/edit_extension", response_class=Response)
def post_api_edit_extension(body: SchemaEdit):
    if len([act for act in glo.running_ex if act.ex.name == body.name]) != 0:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    desc = [x for x in glo.extensions if x.name == body.name]

    if len(desc) == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    try:
        builder = read_extension(body.text).compile(body.name)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    
    delete_extension(glo, desc[0])
    link = write_extension(builder.name, body.text)
    load_extension(glo, builder, link)
    
    return Response(status_code=status.HTTP_200_OK)

@app.get("/api/create_procedure", response_class=Response)
def get_api_create_procedure(name: str):
    desc = [x for x in glo.procedures if x.name == name]

    if len(desc) != 0:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    builder = read_procedure(DEFAULT_PROCEDURE_TEXT).compile(name)
    link = write_procedure(name, DEFAULT_PROCEDURE_TEXT)
    load_procedure(glo, builder, link)
    
    return Response(status_code=status.HTTP_200_OK)

@app.get("/api/create_extension", response_class=Response)
def get_api_create_extension(name: str):
    desc = [x for x in glo.extensions if x.name == name]

    if len(desc) != 0:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    builder = read_extension(DEFAULT_EXTENSION_TEXT).compile(name)
    link = write_extension(name, DEFAULT_EXTENSION_TEXT)
    load_extension(glo, builder, link)
    
    return Response(status_code=status.HTTP_200_OK)

@app.get("/api/delete_procedure", response_class=Response)
def get_api_delete_procedure(name: str):
    if len([act for act in glo.running_proc if act.proc.name == name]) != 0:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    desc = [x for x in glo.procedures if x.name == name]

    if len(desc) == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    delete_procedure(glo, desc[0])
    
    return Response(status_code=status.HTTP_200_OK)

@app.get("/api/delete_extension", response_class=Response)
def get_api_delete_extension(name: str):
    if len([act for act in glo.running_ex if act.ex.name == name]) != 0:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    desc = [x for x in glo.extensions if x.name == name]

    if len(desc) == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    delete_extension(glo, desc[0])
    
    return Response(status_code=status.HTTP_200_OK)

@app.get("/api/admin_restart", response_class=Response)
def get_api_admin_restart():
    if os.name == "nt":
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    os.system("reboot now")
    
    return Response(status_code=status.HTTP_200_OK)

@app.get("/api/admin_shutdown", response_class=Response)
def get_api_admin_shutdown():
    if os.name == "nt":
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    os.system("shutdown now")
    
    return Response(status_code=status.HTTP_200_OK)

if __name__ == "__main__":
    if os.name != "nt":
        ip = "unknown"

        try:
            import netifaces as ni
            ip = ni.ifaddresses("wlan0")[ni.AF_INET][0]["addr"]
        except:
            pass

        try:
            from RPLCD.i2c import CharLCD
            lcd = CharLCD(i2c_expander="PCF8574", address=0x27, port=1, cols=16, rows=2, dotsize=8)
            lcd.clear()

            lcd.write_string(ip)
        except:
            pass

    uvicorn.run(app, host="0.0.0.0", port=80)
    glo.loop.quit()

"""
THINGS TO IMPLEMENT:
actually running on start / loop for basically everything backend / extensions
implement stop
implement admin
implement actual script with openable window
implement create proc/ex
implement edit update proc/ex
implement delete proc/ex
add a valid text to proc/ex
"""