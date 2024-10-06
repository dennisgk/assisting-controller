import os
import time

if os.name != "nt":
    time.sleep(10)

    link = parent_folder.joinpath("update.txt").resolve()

    if link.is_file():
        link.unlink()
        os.system("git -C /home/pi/Desktop/assisting-controller pull")
    
    os.system("python3.12 /home/pi/Desktop/assisting-controller/assisting-controller-server/main.py")