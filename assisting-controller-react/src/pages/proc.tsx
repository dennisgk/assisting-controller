import { components, utils, deps } from "../meta";

const Proc = () => {
  const api = utils.react.use_context(components.ac.api.Context);
  const navigate = deps.router.use_navigate();

  const schema_procedures = utils.react.use_memo(
    () =>
      api.schema.procedures.map((v) =>
        components.ac.api.gen_accordion_procedure(api, v, navigate)
      ),
    [api.schema.procedures]
  );

  const schema_extensions = utils.react.use_memo(
    () =>
      api.schema.extensions.map((v) =>
        components.ac.api.gen_accordion_extension(api, v, navigate)
      ),
    [api.schema.extensions]
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
                              Procedures
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
                                <components.layout.scrollable.Scrollable direction="VERTICAL">
                                  <components.layout.simple_accordion_list.SimpleAccordionList
                                    data={schema_procedures as any}
                                  />
                                </components.layout.scrollable.Scrollable>
                              </components.layout.wrapper.Wrapper>
                            </components.layout.stack.Cell>

                            <components.layout.stack.Cell>
                              <components.layout.wrapper.Wrapper x_padding="MEDIUM">
                                <components.layout.level.Ascend>
                                  <components.layout.simple_button.SimpleButton
                                    ring="HOVER"
                                    background="LEVEL"
                                    on_click={() => {
                                      let name = prompt("Enter procedure name");
                                      if (name === null) return;

                                      api.queue(async () => {
                                        let resp = await fetch(
                                          `/api/create_procedure?name=${name}`
                                        );

                                        if (resp.ok) api.refresh_schema();
                                        else
                                          api.gen_output({
                                            text: "Failed to create procedure",
                                            bold: true,
                                            color: "PRIMARY",
                                          });
                                      });
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
                                          Create Procedure
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
                              Extensions
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
                                <components.layout.scrollable.Scrollable direction="VERTICAL">
                                  <components.layout.simple_accordion_list.SimpleAccordionList
                                    data={schema_extensions as any}
                                  />
                                </components.layout.scrollable.Scrollable>
                              </components.layout.wrapper.Wrapper>
                            </components.layout.stack.Cell>

                            <components.layout.stack.Cell>
                              <components.layout.wrapper.Wrapper x_padding="MEDIUM">
                                <components.layout.level.Ascend>
                                  <components.layout.simple_button.SimpleButton
                                    ring="HOVER"
                                    background="LEVEL"
                                    on_click={() => {
                                      let name = prompt("Enter extension name");
                                      if (name === null) return;

                                      api.queue(async () => {
                                        let resp = await fetch(
                                          `/api/create_extension?name=${name}`
                                        );

                                        if (resp.ok) api.refresh_schema();
                                        else
                                          api.gen_output({
                                            text: "Failed to create extension",
                                            bold: true,
                                            color: "PRIMARY",
                                          });
                                      });
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
                                          Create Extension
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

export { Proc };
