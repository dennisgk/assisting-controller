import { components, deps, utils } from "../meta";

type ColorOption = {
  type: "COLOR_OPTION";
  text: string;
  default: {
    r: number;
    g: number;
    b: number;
  };
};

type SelectOption = {
  type: "SELECT_OPTION";
  text: string;
  options: Array<string>;
  default: string;
};

type SchemaStartProcedureColorArg = {
  type: ColorOption["type"];
  text: string;
  value: ColorOption["default"];
};

type SchemaStartProcedureSelectArg = {
  type: SelectOption["type"];
  text: string;
  value: SelectOption["default"];
};

type Option = ColorOption | SelectOption;

const component_to_hex = (c: number) => {
  let hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

const hex_to_rgb = (hex: string) => {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const Run = () => {
  const [search_params] = deps.router.use_search_params();
  const api = utils.react.use_context(components.ac.api.Context);
  const level = utils.react.use_context(components.layout.level.Context);
  const navigate = deps.router.use_navigate();

  const [options, set_options] = utils.react.use_state<Array<Option>>([]);

  const data = utils.react.use_memo(
    () => [
      ...(
        api.schema.procedures.find((v) => v.name === search_params.get("name"))
          ?.info ?? []
      ).map((x) => ({
        type: "TEXT",
        text: x,
      })),
      ...options,
    ],
    [api, options]
  );

  const changed_options = utils.react.use_ref<
    Array<SchemaStartProcedureColorArg | SchemaStartProcedureSelectArg>
  >([]);

  utils.react.use_effect(() => {
    api.queue(
      async () => {
        let fetch_options = await (
          await fetch(
            `/api/get_procedure_start_args?name=${
              search_params.get("name") ?? ""
            }`
          )
        ).json();

        changed_options.current = fetch_options.map((v: any) =>
          utils.general.match_str_val(v.type, {
            COLOR_OPTION: () => ({
              type: v.type,
              text: v.text,
              value: {
                r: (v as ColorOption).default.r,
                g: (v as ColorOption).default.g,
                b: (v as ColorOption).default.b,
              },
            }),
            SELECT_OPTION: () => ({
              type: v.type,
              text: v.text,
              value: (v as SelectOption).default,
            }),
          })()
        ) as any;

        set_options(fetch_options);
      },
      () => navigate("/")
    );
  }, []);

  return search_params.get("name") === null ? (
    <deps.router.Navigate to="/" />
  ) : (
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
                      {`Run ${search_params.get("name")}`}
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
                        <components.layout.scrollable.Scrollable direction="VERTICAL">
                          <components.layout.stack.Stack
                            direction="VERTICAL"
                            gap="MEDIUM"
                          >
                            {data.map((v) => (
                              <components.layout.stack.Cell
                                key={`${v.type}${v.text}`}
                              >
                                {utils.general.match_str_val(v.type, {
                                  TEXT: () => (
                                    <components.layout.text.Text size="MEDIUM">
                                      {v.text}
                                    </components.layout.text.Text>
                                  ),
                                  COLOR_OPTION: () => (
                                    <components.layout.stack.Stack
                                      direction="HORIZONTAL"
                                      gap="MEDIUM"
                                    >
                                      <components.layout.stack.Cell>
                                        <components.layout.text.Text size="MEDIUM">
                                          {v.text}
                                        </components.layout.text.Text>
                                      </components.layout.stack.Cell>

                                      <components.layout.stack.Cell>
                                        <input
                                          className={[
                                            "grow",
                                            "h-full",
                                            utils.layout.match_background(
                                              "LEVEL",
                                              components.layout.level.get_ascend(
                                                components.layout.level.get_ascend(
                                                  level
                                                )
                                              )
                                            ),
                                          ].join_class_name()}
                                          type="color"
                                          defaultValue={`#${component_to_hex(
                                            (v as ColorOption).default.r
                                          )}${component_to_hex(
                                            (v as ColorOption).default.g
                                          )}${component_to_hex(
                                            (v as ColorOption).default.b
                                          )}`}
                                          onChange={(ev) => {
                                            changed_options.current.find(
                                              (x) => x.text === v.text
                                            )!.value = hex_to_rgb(
                                              ev.target.value
                                            )!;
                                          }}
                                        />
                                      </components.layout.stack.Cell>
                                    </components.layout.stack.Stack>
                                  ),
                                  SELECT_OPTION: () => (
                                    <components.layout.stack.Stack
                                      direction="HORIZONTAL"
                                      gap="MEDIUM"
                                    >
                                      <components.layout.stack.Cell>
                                        <components.layout.text.Text size="MEDIUM">
                                          {v.text}
                                        </components.layout.text.Text>
                                      </components.layout.stack.Cell>

                                      <components.layout.stack.Cell>
                                        <select
                                          className={[
                                            "grow",
                                            utils.layout.match_background(
                                              "LEVEL",
                                              components.layout.level.get_ascend(
                                                components.layout.level.get_ascend(
                                                  level
                                                )
                                              )
                                            ),
                                            utils.layout.match_size("MEDIUM"),
                                          ].join_class_name()}
                                          defaultValue={
                                            (v as SelectOption).default
                                          }
                                          onChange={(ev) => {
                                            changed_options.current.find(
                                              (x) => x.text === v.text
                                            )!.value = ev.target.value;
                                          }}
                                        >
                                          {(v as SelectOption).options.map(
                                            (x) => (
                                              <option key={x} value={x}>
                                                {x}
                                              </option>
                                            )
                                          )}
                                        </select>
                                      </components.layout.stack.Cell>
                                    </components.layout.stack.Stack>
                                  ),
                                })()}
                              </components.layout.stack.Cell>
                            ))}
                          </components.layout.stack.Stack>
                        </components.layout.scrollable.Scrollable>
                      </components.layout.wrapper.Wrapper>
                    </components.layout.stack.Cell>

                    <components.layout.stack.Cell>
                      <components.layout.wrapper.Wrapper x_padding="MEDIUM">
                        <components.layout.level.Ascend>
                          <components.layout.simple_button.SimpleButton
                            ring="HOVER"
                            background="LEVEL"
                            on_click={() =>
                              api.queue(async () => {
                                let resp = await fetch("/api/start_procedure", {
                                  method: "POST",
                                  body: JSON.stringify({
                                    name: search_params.get("name"),
                                    args: changed_options.current,
                                  }),
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                });

                                if (!resp.ok)
                                  api.gen_output({
                                    text: "An exception occurred while starting the procedure",
                                    bold: true,
                                    color: "PRIMARY",
                                  });
                                else
                                  api.gen_output({
                                    text: `Procedure "${search_params.get(
                                      "name"
                                    )}" started`,
                                  });

                                api.refresh_schema();

                                api.queue(async () => navigate("/"));
                              })
                            }
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
                                  Run
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

export { Run };
