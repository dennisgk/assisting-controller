import { components, types, utils } from "../../meta";

type SimpleButtonProps = types.react.OptionalChildrenProps & {
  ring?: types.layout.Ring | undefined;
  on_click?: types.general.Handler | undefined;
  group?: types.layout.Group | undefined;
  background?: types.layout.Background | undefined;
};

const SimpleButton = (props: SimpleButtonProps) => {
  const level = utils.react.use_context(components.layout.level.Context);

  return (
    <button
      className={[
        "grow",
        utils.layout.match_background(props.background, level),
        utils.layout.match_border_radius("MEDIUM"),
        utils.layout.match_overflow("HIDDEN"),
        utils.layout.match_group(props.group),
        utils.layout.match_ring(
          props.ring,
          components.layout.level.get_ascend(level)
        ),
      ].join_class_name()}
      onClick={() => props.on_click?.()}
    >
      {props.children ?? <></>}
    </button>
  );
};

export { SimpleButton };
