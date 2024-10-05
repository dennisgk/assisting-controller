import { components, utils } from "../meta";

const names = [
  "Jack Andersen",
  "Sammy Atkins",
  "Shubro Biswas",
  "Jonah Brandon",
  "Caleb Deardorff",
  "Aiden Duncan",
  "Matt Dunlap",
  "Guilherme Franco",
  "Avi Ignaczak",
  "Brian Jaffa",
  "Nate Jeup",
  "Dennis Kountouris",
  "Mac Lewis",
  "Mateusz Lisiecki",
  "Lucas Louiso",
  "Burton Lu",
  "Trent Melinauskas",
  "Mason Penhallegon",
  "Stephen Rashevich",
  "Hameed Siddiqui",
  "Gabe Skaar",
  "Hassan Sufi",
  "Josh Thomas",
  "Garrett Weber",
];

const Settings = () => {
  const api = utils.react.use_context(components.ac.api.Context);

  const schema_admin = utils.react.use_memo(
    () =>
      api.schema.admin.map((v) => (
        <components.layout.stack.Cell key={v.text}>
          <components.layout.level.Ascend>
            <components.layout.simple_button.SimpleButton
              ring="HOVER"
              background="LEVEL"
              on_click={() => {
                if (v.confirm_nullable === null) {
                  eval(v.on_click_body);
                  return;
                }

                if (!confirm(v.confirm_nullable)) return;

                eval(v.on_click_body);
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
                    {v.text}
                  </components.layout.text.Text>
                </components.layout.align.Align>
              </components.layout.wrapper.Wrapper>
            </components.layout.simple_button.SimpleButton>
          </components.layout.level.Ascend>
        </components.layout.stack.Cell>
      )),
    [api.schema.admin]
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
                              Info
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
                            <components.layout.stack.Stack direction="VERTICAL">
                              <components.layout.stack.Cell>
                                <components.layout.text.Text size="MEDIUM">
                                  Check the tutorials for help.
                                </components.layout.text.Text>
                              </components.layout.stack.Cell>

                              <components.layout.stack.Cell>
                                <components.layout.container.Container height="h-2" />
                              </components.layout.stack.Cell>

                              <components.layout.stack.Cell>
                                <components.layout.text.Text size="MEDIUM">
                                  Glory to Theta Chi Spring 24:
                                </components.layout.text.Text>
                              </components.layout.stack.Cell>

                              <components.layout.stack.Cell>
                                <components.layout.container.Container height="h-2" />
                              </components.layout.stack.Cell>

                              {
                                names.map((v) => (
                                  <components.layout.stack.Cell key={v}>
                                    <components.layout.text.Text size="MEDIUM">
                                      {v}
                                    </components.layout.text.Text>
                                  </components.layout.stack.Cell>
                                )) as any
                              }
                            </components.layout.stack.Stack>
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
                              Admin
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
                            <components.layout.stack.Stack
                              direction="VERTICAL"
                              gap="MEDIUM"
                            >
                              {schema_admin}
                            </components.layout.stack.Stack>
                          </components.layout.scrollable.Scrollable>
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

export { Settings };
