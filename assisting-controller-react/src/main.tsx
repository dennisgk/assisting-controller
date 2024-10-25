import "./stylesheets/index.css";

import { utils, pages, deps } from "./meta";

//https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs/loader.js
deps.monaco.loader.config({
  paths: {
    vs: "/assets/loader.js",
  },
});

utils.linq.init_arr_prototype();

utils.doc.use_theme();

utils.react
  .create_root(utils.react.get_root_elem())
  .render(<pages.root.Root />);
