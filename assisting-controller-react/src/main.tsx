import "./stylesheets/index.css";

import { utils, pages } from "./meta";

utils.linq.init_arr_prototype();

utils.doc.use_theme();

utils.react
  .create_root(utils.react.get_root_elem())
  .render(<pages.root.Root />);
