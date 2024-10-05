const match_str_val = <T extends string, TRet = any>(
  val: T,
  full: {
    [V in T]: TRet;
  }
) => {
  return full[val];
};

const match_num_val = <TRet = any,>(val: number, full: Array<TRet>): TRet => {
  if (full.length === 0) return undefined as any as TRet;

  if (val <= 0) {
    return full[0];
  }

  if (Number.isInteger(val) && val < full.length) {
    return full[val];
  }

  return full[full.length - 1];
};

export { match_str_val, match_num_val };
