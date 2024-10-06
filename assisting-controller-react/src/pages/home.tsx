import { components, utils } from "../meta";

const Home = () => {
  const api = utils.react.use_context(components.ac.api.Context);

  const schema_running = utils.react.use_memo(
    () =>
      api.schema.running.map((v) =>
        components.ac.api.gen_accordion_running(
          api,
          api.schema.procedures.find((x) => x.name === v.name)!,
          v.buttons
        )
      ),
    [api.schema.running, api.schema.procedures, api.gen_output]
  );

  return (
    <components.ac.sidebar.Sidebar>
      <components.layout.wrapper.Wrapper
        x_padding="MEDIUM"
        y_padding="MEDIUM"
        overflow="HIDDEN"
      >
        <components.layout.size_breakpoint.SizeBreakpoint
          def={
            <components.layout.grid.Grid
              cols={["grid-cols-1", "lg:grid-cols-2"]}
              rows={["grid-rows-2", "lg:grid-rows-1"]}
              gap="MEDIUM"
              overflow="HIDDEN"
            >
              <components.layout.grid.Cell overflow="HIDDEN">
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
                              Active
                            </components.layout.text.Text>
                          </components.layout.wrapper.Wrapper>
                        </components.layout.level.Ascend>
                      </components.layout.stack.Cell>

                      <components.layout.stack.Cell grow overflow="HIDDEN">
                        <components.layout.wrapper.Wrapper
                          x_padding="MEDIUM"
                          y_padding="MEDIUM"
                        >
                          <components.layout.scrollable.Scrollable direction="VERTICAL">
                            <components.layout.simple_accordion_list.SimpleAccordionList
                              data={schema_running as any}
                            />
                          </components.layout.scrollable.Scrollable>
                        </components.layout.wrapper.Wrapper>
                      </components.layout.stack.Cell>
                    </components.layout.stack.Stack>
                  </components.layout.wrapper.Wrapper>
                </components.layout.level.Ascend>
              </components.layout.grid.Cell>

              <components.layout.grid.Cell overflow="HIDDEN">
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
                              Output
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
                            <components.layout.stack.Cell
                              grow
                              overflow="HIDDEN"
                            >
                              <components.layout.wrapper.Wrapper x_padding="MEDIUM">
                                <div className="flex grow select-text overflow-hidden">
                                  <components.layout.scrollable.Scrollable direction="VERTICAL">
                                    <components.layout.stack.Stack direction="VERTICAL">
                                      {api.output}
                                    </components.layout.stack.Stack>
                                  </components.layout.scrollable.Scrollable>
                                </div>
                              </components.layout.wrapper.Wrapper>
                            </components.layout.stack.Cell>

                            <components.layout.stack.Cell>
                              <components.layout.wrapper.Wrapper x_padding="MEDIUM">
                                <components.layout.level.Ascend>
                                  <components.layout.simple_button.SimpleButton
                                    ring="HOVER"
                                    background="LEVEL"
                                    on_click={() => {
                                      if (
                                        !confirm(
                                          "Are you sure you want to clear output?"
                                        )
                                      )
                                        return;
                                      api.clear_output();
                                    }}
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
                                          Clear
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
              </components.layout.grid.Cell>
            </components.layout.grid.Grid>
          }
        />
      </components.layout.wrapper.Wrapper>
    </components.ac.sidebar.Sidebar>
  );
};

export { Home };
