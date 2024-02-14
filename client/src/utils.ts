export type Optimistic<T> = T & {
  isOptimistic?: boolean;
};

export type Without<T> = Omit<T, "created_at" | "id">;

export const isOptimistic = (...values: Optimistic<any>[]) => values.filter((value) => value.isOptimistic).length === 1;

export const throwError = (message: string) => {
  throw new Error(message);
};
