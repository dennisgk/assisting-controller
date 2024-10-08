import { types, utils } from "../../meta";

type ScrollableProps = types.react.RequiredChildrenProps & {
  direction: types.layout.AnyDirection;
  width?: types.layout.Width | undefined;
  height?: types.layout.Height | undefined;
};

const Scrollable = (props: ScrollableProps) => (
  <div
    className={[
      "flex",
      "grow",
      utils.layout.match_overflow_direction(props.direction),
      utils.layout.match_width(props.width),
      utils.layout.match_height(props.height),
    ].join_class_name()}
  >
    {props.children}
  </div>
);

export { Scrollable };
