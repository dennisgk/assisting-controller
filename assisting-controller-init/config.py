import os
import pathlib

from fastapi import HTTPException, status
from fastapi.responses import PlainTextResponse, Response

def admin_update(parent_folder):
    if os.name == "nt":
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED)

    with open(parent_folder.joinpath("update.txt").resolve(), "wb") as stream:
        stream.write("update".encode("utf-8"))
    os.system("reboot now")

    return Response(status_code=status.HTTP_200_OK)

def admin_logs(parent_folder):
    if os.name == "nt":
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    with open(parent_folder.parent.parent.joinpath("logs").joinpath("cronlog"), "r") as stream:
        text = stream.read()

    return PlainTextResponse(content=text)

def admin_restart(parent_folder):
    if os.name == "nt":
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    os.system("reboot now")
    
    return Response(status_code=status.HTTP_200_OK)

def admin_shutdown(parent_folder):
    if os.name == "nt":
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    os.system("shutdown now")
    
    return Response(status_code=status.HTTP_200_OK)

def on_start(parent_folder):
    if os.name != "nt":
        os.system("systemctl start NetworkManager")
        os.system("nmcli device wifi hotspot ssid \"Assisting Controller\" password assistinghand1856 ifname wlan0")


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

register_admin_restart(admin_restart)
register_admin_shutdown(admin_shutdown)
register_admin_update(admin_update)
register_admin_logs(admin_logs)
register_on_start(on_start)