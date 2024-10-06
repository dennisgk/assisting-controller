import pathlib
import os

if __name__ == "__main__":
    with open(pathlib.Path(__file__).parent.joinpath("init.py"), "r") as stream:
        text = stream.read()

    def scope_exec():
        exec(text, { "parent_folder": pathlib.Path(__file__).parent })

    scope_exec()
