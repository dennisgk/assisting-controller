import { components } from "../../../meta";

const Header = () => (
  <components.layout.level.Ascend>
    <components.layout.container.Container
      height="h-14"
      width="w-full"
      background="LEVEL"
      x_padding="LARGE"
      y_padding="LARGE"
    >
      <components.layout.align.Align direction="VERTICAL" align="CENTER">
        <components.layout.container.Container height="h-6" width="w-10">
          <components.icon.logo.Logo color="PRIMARY" stroke={1} />
        </components.layout.container.Container>
      </components.layout.align.Align>
    </components.layout.container.Container>
  </components.layout.level.Ascend>
);

export default Header;
