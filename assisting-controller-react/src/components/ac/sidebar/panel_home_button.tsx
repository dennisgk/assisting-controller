import { components, deps } from "../../../meta";

const PanelHomeButton = () => {
  const navigate = deps.router.use_navigate();
  const location = deps.router.use_location();

  return (
    <components.layout.icon_button.IconButton
      icon={components.icon.home.Home}
      ring={location.pathname.match(/^\/$/gm) !== null ? "PRIMARY" : "HOVER"}
      on_click={() => navigate("/")}
    />
  );
};

export default PanelHomeButton;
