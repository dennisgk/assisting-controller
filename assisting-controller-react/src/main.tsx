import "./stylesheets/index.css";

import { utils, pages, deps } from "./meta";

//https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs/loader.js
//C:\Users\DennisK\Desktop\Folders\Projects\assisting-controller\assisting-controller-react\node_modules\monaco-editor\min
deps.monaco.loader.config({
  paths: {
    vs: window.location.origin + "/assets",
  },
});

utils.linq.init_arr_prototype();

utils.doc.use_theme();

utils.react
  .create_root(utils.react.get_root_elem())
  .render(<pages.root.Root />);
