import { components, deps } from "../../../meta";

const PanelSettingsButton = () => {
  const navigate = deps.router.use_navigate();
  const location = deps.router.use_location();

  return (
    <components.layout.icon_button.IconButton
      icon={components.icon.settings.Settings}
      ring={
        location.pathname.match(/^\/settings$/gm) !== null ? "PRIMARY" : "HOVER"
      }
      on_click={() => navigate("/settings")}
    />
  );
};

export default PanelSettingsButton;
