
export type Optimistic<T> = T & {
  isOptimistic?: boolean;
}

export const isOptimistic = (...values: Optimistic<any>[] ) => values.filter((value) => value.isOptimistic).length === 1
