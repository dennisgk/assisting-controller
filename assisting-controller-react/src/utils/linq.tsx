declare global {
  interface Array<T> {
    flatten(selector: (obj: T) => Array<T>): Array<T>;
    transform<TRet>(transformer: (arr: Array<T>) => TRet): TRet;
    map_or_empty<TRet, TEmpty>(
      selector: (value: T, index: number, array: Array<T>) => TRet,
      empty: () => TEmpty
    ): Array<TRet> | TEmpty;
    remove(...args: Array<T>): void;
    keep(selector: (obj: T) => boolean): void;
    distinct(): Array<T>;
    first_or<TOther>(other: TOther): T | TOther;
    at_or<TOther>(at: number, other: TOther): T | TOther;
    join_class_name(): [T] extends [string] ? string : never;
  }
}

const flatten = <T,>(
  arr: Array<T>,
  selector: (obj: T) => Array<T>
): Array<T> => {
  let ret_arr = [];

  for (let i = 0; i < arr.length; i++) {
    ret_arr.push(arr[i]);

    let add_selected = selector(arr[i]);
    let add_subtree = flatten(add_selected, selector);

    ret_arr.push(...add_subtree);
  }

  return ret_arr;
};

const init_arr_prototype_flatten = () => {
  Array.prototype.flatten = function <T>(selector: (obj: T) => Array<T>) {
    return flatten(this, selector);
  };
};

const init_arr_prototype_transform = () => {
  Array.prototype.transform = function <T, TRet>(
    transformer: (arr: Array<T>) => TRet
  ) {
    return transformer(this);
  };
};

const init_arr_prototype_map_or_empty = () => {
  Array.prototype.map_or_empty = function <T, TRet, TEmpty>(
    selector: (value: T, index: number, array: Array<T>) => TRet,
    empty: () => TEmpty
  ) {
    if (this.length === 0) {
      return empty();
    }

    return this.map(selector);
  };
};

const init_arr_prototype_first_or = () => {
  Array.prototype.first_or = function <TOther>(other: TOther) {
    if (this.length === 0) return other;

    return this[0];
  };
};

const init_arr_prototype_at_or = () => {
  Array.prototype.at_or = function <TOther>(at: number, other: TOther) {
    if (this.length >= at + 1) {
      return this[at];
    }

    return other;
  };
};

const init_arr_prototype_remove = () => {
  Array.prototype.remove = function <T>(...args: Array<T>) {
    for (let i = 0; i < args.length; i++) {
      this.splice(this.indexOf(args[i]), 1);
    }
  };
};

const init_arr_prototype_keep = () => {
  Array.prototype.keep = function <T>(selector: (obj: T) => boolean) {
    let to_rem = this.filter((obj) => !selector(obj));
    this.remove(...to_rem);
  };
};

const init_arr_prototype_distinct = () => {
  Array.prototype.distinct = function <T>() {
    return this.reduce<Array<T>>(
      (accumulator, cur) =>
        accumulator.find((v) => v === cur) === undefined
          ? [...accumulator, cur]
          : accumulator,
      []
    );
  };
};

const init_arr_prototype_join_class_name = () => {
  Array.prototype.join_class_name = function () {
    return this.reduce(
      (acc, val) =>
        typeof val === "string" && val !== ""
          ? acc.length === 0
            ? val
            : `${acc} ${val}`
          : acc,
      ""
    );
  };
};

const init_arr_prototype = () => {
  init_arr_prototype_flatten();
  init_arr_prototype_transform();
  init_arr_prototype_map_or_empty();
  init_arr_prototype_remove();
  init_arr_prototype_keep();
  init_arr_prototype_distinct();
  init_arr_prototype_first_or();
  init_arr_prototype_at_or();
  init_arr_prototype_join_class_name();
};

export { init_arr_prototype };