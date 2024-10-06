import pathlib
import os

if __name__ == "__main__":
    if os.name != "nt":
        import time
        time.sleep(10)
        
    with open(pathlib.Path(__file__).parent.joinpath("init.py"), "r") as stream:
        text = stream.read()

    def scope_exec():
        exec(text, { "parent_folder": pathlib.Path(__file__).parent })

    scope_exec()
