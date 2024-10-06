import { deps, components, utils, types, pages } from "../meta";

import * as extension from "./edit/extension";
import * as procedure from "./edit/procedure";

type EditConsumerProps = {
  header: (saved: boolean) => string;
  on_save: (on_success: types.general.Handler) => void;
  value: string;
  on_change: types.general.Handler<string>;
};
type EditChildProps = {
  edit: types.react.FC<EditConsumerProps>;
};

const EditChild = (props: EditConsumerProps) => {
  const monaco_theme = deps.monaco.use_theme();
  const api = utils.react.use_context(components.ac.api.Context);

  const [saved, set_saved] = utils.react.use_state(true);
  const blocker = deps.router.use_blocker(() => !saved);

  utils.react.use_effect(() => {
    if (blocker.state !== "blocked") return;

    if (confirm("Are you sure you want to exit without saving?")) {
      blocker.proceed();
      return;
    }

    blocker.reset();
  }, [blocker.state]);

  const on_success = utils.react.use_callback(() => {
    api.refresh_schema();
    api.queue(async () => set_saved(true));
  }, []);

  utils.react.use_effect(() => {
    let ev_listener = (ev: KeyboardEvent) => {
      if (ev.ctrlKey && ev.key === "s") {
        ev.preventDefault();
        props.on_save(on_success);
      }
    };

    document.addEventListener("keydown", ev_listener);

    return () => document.removeEventListener("keydown", ev_listener);
  }, [props.on_save]);

  return (
    <components.ac.sidebar.Sidebar>
      <components.layout.wrapper.Wrapper
        x_padding="MEDIUM"
        y_padding="MEDIUM"
        overflow="HIDDEN"
      >
        <components.layout.level.Ascend>
          <components.layout.wrapper.Wrapper
            border_radius="MEDIUM"
            background="LEVEL"
            overflow="HIDDEN"
          >
            <components.layout.stack.Stack
              direction="VERTICAL"
              overflow="HIDDEN"
            >
              <components.layout.stack.Cell>
                <components.layout.level.Ascend>
                  <components.layout.wrapper.Wrapper
                    background="LEVEL"
                    border_radius="MEDIUM"
                    x_padding="MEDIUM"
                    y_padding="MEDIUM"
                  >
                    <components.layout.text.Text size="LARGE">
                      {props.header(saved)}
                    </components.layout.text.Text>
                  </components.layout.wrapper.Wrapper>
                </components.layout.level.Ascend>
              </components.layout.stack.Cell>

              <components.layout.stack.Cell grow overflow="HIDDEN">
                <components.layout.wrapper.Wrapper
                  overflow="HIDDEN"
                  y_padding="MEDIUM"
                >
                  <components.layout.stack.Stack
                    direction="VERTICAL"
                    overflow="HIDDEN"
                    gap="MEDIUM"
                  >
                    <components.layout.stack.Cell grow overflow="HIDDEN">
                      <components.layout.wrapper.Wrapper x_padding="MEDIUM">
                        <div className="grow">
                          <deps.monaco.Editor
                            height="100%"
                            defaultLanguage="python"
                            value={props.value}
                            theme={monaco_theme}
                            loading={<components.ac.api.Loading />}
                            onChange={(value) => {
                              if (value === undefined) return;

                              set_saved(false);
                              props.on_change(value);
                            }}
                          />
                        </div>
                      </components.layout.wrapper.Wrapper>
                    </components.layout.stack.Cell>

                    <components.layout.stack.Cell>
                      <components.layout.wrapper.Wrapper x_padding="MEDIUM">
                        <components.layout.level.Ascend>
                          <components.layout.simple_button.SimpleButton
                            ring="HOVER"
                            background="LEVEL"
                            on_click={() => props.on_save(on_success)}
                          >
                            <components.layout.wrapper.Wrapper
                              x_padding="MEDIUM"
                              y_padding="MEDIUM"
                            >
                              <components.layout.align.Align
                                direction="HORIZONTAL"
                                align="CENTER"
                              >
                                <components.layout.text.Text size="MEDIUM">
                                  Save
                                </components.layout.text.Text>
                              </components.layout.align.Align>
                            </components.layout.wrapper.Wrapper>
                          </components.layout.simple_button.SimpleButton>
                        </components.layout.level.Ascend>
                      </components.layout.wrapper.Wrapper>
                    </components.layout.stack.Cell>
                  </components.layout.stack.Stack>
                </components.layout.wrapper.Wrapper>
              </components.layout.stack.Cell>
            </components.layout.stack.Stack>
          </components.layout.wrapper.Wrapper>
        </components.layout.level.Ascend>
      </components.layout.wrapper.Wrapper>
    </components.ac.sidebar.Sidebar>
  );
};

const Edit = () => (
  <deps.router.Routes>
    <deps.router.Route
      path="extension"
      element={<pages.edit.extension.Extension edit={EditChild} />}
    />
    <deps.router.Route
      path="procedure"
      element={<pages.edit.procedure.Procedure edit={EditChild} />}
    />
    <deps.router.Route path="*" element={<deps.router.Navigate to="/" />} />
  </deps.router.Routes>
);

export { Edit, extension, procedure };
export type { EditChildProps };
