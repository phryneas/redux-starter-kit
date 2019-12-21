/**
 * return True if T is `any`, otherwise return False
 * taken from https://github.com/joonhocho/tsdef
 *
 * @internal
 */
export declare type IsAny<T, True, False = never> = true | false extends (T extends never ? true : false) ? True : False;
/**
 * return True if T is `unknown`, otherwise return False
 * taken from https://github.com/joonhocho/tsdef
 *
 * @internal
 */
export declare type IsUnknown<T, True, False = never> = unknown extends T ? IsAny<T, False, True> : False;
/**
 * @internal
 */
export declare type IfMaybeUndefined<P, True, False> = [undefined] extends [P] ? True : False;
/**
 * @internal
 */
export declare type IfVoid<P, True, False> = [void] extends [P] ? True : False;
/**
 * @internal
 */
export declare type IsEmptyObj<T, True, False = never> = T extends any ? keyof T extends never ? IsUnknown<T, False, IfMaybeUndefined<T, False, IfVoid<T, False, True>>> : False : never;
/**
 * returns True if TS version is above 3.5, False if below.
 * uses feature detection to detect TS version >= 3.5
 * * versions below 3.5 will return `{}` for unresolvable interference
 * * versions above will return `unknown`
 *
 * @internal
 */
export declare type AtLeastTS35<True, False> = [True, False][IsUnknown<ReturnType<(<T>() => T)>, 0, 1>];
/**
 * @internal
 */
export declare type IsUnknownOrNonInferrable<T, True, False> = AtLeastTS35<IsUnknown<T, True, False>, IsEmptyObj<T, True, IsUnknown<T, True, False>>>;
