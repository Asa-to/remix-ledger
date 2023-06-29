export type StringifyDates<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K];
};
