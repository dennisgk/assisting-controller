import os
import pathlib

def admin_update():
    if os.name != "nt":
        with open(pathlib.Path(__file__).parent.parent.joinpath("assisting-controller-init").joinpath("update.txt").resolve(), "wb") as stream:
            stream.write("update".encode("utf-8"))
        os.system("reboot now")

def admin_logs():
    if os.name != "nt":
        with open(pathlib.Path(__file__).parent.parent.parent.joinpath("logs").joinpath("cronlog"), "r") as stream:
            text = stream.read()

        return text
    
    return ""