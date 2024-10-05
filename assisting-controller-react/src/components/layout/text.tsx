import { types, utils } from "../../meta";

type TextProps = types.react.RequiredChildrenProps & {
  size: types.layout.Size;
  bold?: types.layout.Bold | undefined;
  overflow?: types.layout.Overflow | undefined;
  align?: types.layout.Align | undefined;
  color?: types.layout.Color | undefined;
};

const Text = (props: TextProps) => (
  <span
    className={[
      utils.layout.match_size(props.size),
      utils.layout.match_bold(props.bold),
      utils.layout.match_text_overflow(props.overflow),
      utils.layout.match_text_align(props.align),
      utils.layout.match_color(props.color),
    ].join_class_name()}
  >
    {props.children}
  </span>
);

export { Text };
