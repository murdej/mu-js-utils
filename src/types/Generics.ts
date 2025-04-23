export type OptionalOf<T> = {
    [K in keyof T]?: T[K];
};
