import { types, utils } from "../../meta";

type CellProps<TGrow extends types.layout.Grow | undefined> = {
  grow?: TGrow;
  overflow?: types.layout.Overflow | undefined;
} & (TGrow extends true
  ? types.react.OptionalChildrenProps
  : types.react.RequiredChildrenProps);

const Cell = <TGrow extends types.layout.Grow | undefined = undefined>(
  props: CellProps<TGrow>
) => (
  <div
    className={[
      "flex",
      utils.layout.match_grow(props.grow),
      utils.layout.match_overflow(props.overflow),
    ].join_class_name()}
  >
    {props.children ?? <></>}
  </div>
);

type StackProps = {
  direction: types.layout.Direction;
  gap?: types.layout.Gap | undefined;
  overflow?: types.layout.Overflow | undefined;
} & types.react.RequiredChildrenProps;

const Stack = (props: StackProps) => (
  <div
    className={[
      "flex",
      "grow",
      utils.layout.match_direction(props.direction),
      utils.general.match_str_val(props.direction, {
        HORIZONTAL: utils.layout.match_x_gap(props.gap),
        VERTICAL: utils.layout.match_y_gap(props.gap),
      }),
      utils.layout.match_overflow(props.overflow),
    ].join_class_name()}
  >
    {props.children}
  </div>
);

export { Cell, Stack };
