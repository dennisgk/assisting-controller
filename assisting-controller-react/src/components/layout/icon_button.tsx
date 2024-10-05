import { components, types, utils } from "../../meta";

type IconButtonProps = {
  icon: types.react.FC<components.icon.Props>;
  background?: types.layout.Background | undefined;
  ring?: types.layout.Ring | undefined;
  on_click?: types.general.Handler | undefined;
};

const IconButton = (props: IconButtonProps) => {
  const level = utils.react.use_context(components.layout.level.Context);

  return (
    <button
      className={[
        "grow",
        utils.layout.match_border_radius("MEDIUM"),
        utils.layout.match_x_padding("MEDIUM"),
        utils.layout.match_y_padding("MEDIUM"),
        utils.layout.match_ring(
          props.ring,
          components.layout.level.get_ascend(level)
        ),
        utils.layout.match_background(props.background, level),
      ].join_class_name()}
      onClick={() => props.on_click?.()}
    >
      <props.icon color="PRIMARY" stroke={2} />
    </button>
  );
};

export { IconButton };
