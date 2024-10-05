import { components, deps } from "../../../meta";

const PanelProcButton = () => {
  const navigate = deps.router.use_navigate();
  const location = deps.router.use_location();

  return (
    <components.layout.icon_button.IconButton
      icon={components.icon.folder.Folder}
      ring={
        location.pathname.match(/^\/proc$|^\/edit|^\/run/gm) !== null
          ? "PRIMARY"
          : "HOVER"
      }
      on_click={() => navigate("/proc")}
    />
  );
};

export default PanelProcButton;
