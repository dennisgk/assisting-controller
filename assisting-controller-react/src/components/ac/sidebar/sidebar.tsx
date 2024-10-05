import { types, components } from "../../../meta";

const Sidebar = (props: types.react.ElemChildrenProps) => (
  <components.layout.size_breakpoint.SizeBreakpoint
    def={
      <components.layout.stack.Stack direction="VERTICAL" overflow="HIDDEN">
        <components.layout.stack.Cell>
          <components.ac.sidebar.Header />
        </components.layout.stack.Cell>

        <components.layout.stack.Cell grow overflow="HIDDEN">
          <components.layout.scrollable.Scrollable direction="VERTICAL">
            {props.children}
          </components.layout.scrollable.Scrollable>
        </components.layout.stack.Cell>

        <components.layout.stack.Cell>
          <components.ac.sidebar.Panel />
        </components.layout.stack.Cell>
      </components.layout.stack.Stack>
    }
    md={
      <components.layout.stack.Stack direction="HORIZONTAL" overflow="HIDDEN">
        <components.layout.stack.Cell>
          <components.ac.sidebar.Panel />
        </components.layout.stack.Cell>

        <components.layout.stack.Cell grow overflow="HIDDEN">
          <components.layout.stack.Stack direction="VERTICAL" overflow="HIDDEN">
            <components.layout.stack.Cell>
              <components.ac.sidebar.Header />
            </components.layout.stack.Cell>

            <components.layout.stack.Cell grow overflow="HIDDEN">
              <components.layout.scrollable.Scrollable direction="VERTICAL">
                {props.children}
              </components.layout.scrollable.Scrollable>
            </components.layout.stack.Cell>
          </components.layout.stack.Stack>
        </components.layout.stack.Cell>
      </components.layout.stack.Stack>
    }
  />
);

export default Sidebar;
