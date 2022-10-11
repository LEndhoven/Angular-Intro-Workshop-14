export type Predicate<T> = (value: T) => boolean;

export function notUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function notNullOrUndefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

export function notNull<T>(value: T | null): value is T {
  return value !== null;
}

export function not<T extends (...args: unknown[]) => boolean>(func: T): T {
  return function (this: unknown, ...args: unknown[]): boolean {
    return !func.apply(this, args);
  } as T;
}

export function equalTo<T>(value: T): Predicate<T> {
  return (otherValue: T) => otherValue === value;
}
