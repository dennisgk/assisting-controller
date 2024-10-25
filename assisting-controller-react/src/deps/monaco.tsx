import Editor, { Monaco, loader } from "@monaco-editor/react";
import { utils } from "../meta";

const use_theme = () => {
  const [theme, set_theme] = utils.react.use_state<string>(
    window.matchMedia(utils.layout.match_dark_theme()).matches
      ? "vs-dark"
      : "light"
  );

  utils.react.use_effect(() => {
    let listener = ({ matches }: { matches: boolean }) => {
      if (matches && theme !== "vs-dark") {
        set_theme("vs-dark");
      }

      if (!matches && theme === "vs-dark") {
        set_theme("light");
      }
    };

    let watcher = window.matchMedia(utils.layout.match_dark_theme());

    watcher.addEventListener("change", listener);

    return () => watcher.removeEventListener("change", listener);
  }, [theme]);

  return theme;
};

export type { Monaco };
export { Editor, use_theme, loader };
