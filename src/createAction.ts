import { Action } from 'redux'

/**
 * An action with a string type and an associated payload. This is the
 * type of action returned by `createAction()` action creators.
 *
 * @template P The type of the action's payload.
 * @template T the type used for the action type.
 */
export interface PayloadAction<P = any, T extends string = string>
  extends Action<T> {
  payload: P
}

type IfAny<T, Y, N> = 0 extends (1 & T) ? Y : N
type IsAny<T> = IfAny<T, true, false>

export interface MetaAction<M = any, T extends string = string>
  extends Action<T> {
  meta: M
}

export interface PayloadMetaAction<P = any, M = any, T extends string = string>
  extends PayloadAction<P, T>,
    MetaAction<M, T> {}

type CreatedPayloadAction<P, T extends string> = IsAny<P> extends true
  ? PayloadAction<P, T>
  : P extends void
  ? Action<T>
  : PayloadAction<P, T>

type CreatedMetaAction<M, T extends string> = IsAny<M> extends true
  ? MetaAction<M, T>
  : M extends void
  ? Action<T>
  : MetaAction<M, T>

// @internal
export type CreatedAction<P, M, T extends string> = CreatedPayloadAction<P, T> &
  CreatedMetaAction<M, T>

/**
 * An action creator that produces actions with a `payload` attribute.
 */
export type PayloadActionCreator<
  P = any,
  T extends string = string,
  A extends any[] = IsAny<P> extends true ? [any?] : [P],
  M = void
> = {
  (...args: A): CreatedAction<P, M, T>
  type: T
}

export type PayloadCreator<A extends any[] = [any], P = any> = (...args: A) => P
export type MetaCreator<A extends any[] = [any], M = any> = (...args: A) => M

/**
 * A utility function to create an action creator for the given action type
 * string. The action creator accepts a single argument, which will be included
 * in the action object as a field called payload. The action creator function
 * will also have its toString() overriden so that it returns the action type,
 * allowing it to be used in reducer logic that is looking for that action type.
 *
 * @param type The action type to use for created actions.
 */

export function createAction<P = any, T extends string = string>(
  type: T
): PayloadActionCreator<P, T, [P]>

export function createAction<
  T extends string = string,
  A extends any[] = [any],
  P = A[0],
  M = void
>(
  type: T,
  payloadCreator?: PayloadCreator<A, P>,
  metaCreator?: MetaCreator<A, M>
): PayloadActionCreator<P, T, A, M>

export function createAction<
  T extends string = string,
  A extends any[] = [any],
  P = A[0],
  M = void
>(
  type: T,
  payloadCreator?: PayloadCreator<any, any>,
  metaCreator?: MetaCreator<any, any>
): PayloadActionCreator<P, T, A, M> {
  function actionCreator(...args: A): CreatedAction<P, M, T> {
    return {
      type,
      payload: payloadCreator ? payloadCreator(...args) : args[0],
      ...(metaCreator ? metaCreator(...args) : ({} as any))
    }
  }

  actionCreator.toString = (): T => `${type}` as T

  actionCreator.type = type

  return actionCreator
}

/**
 * Returns the action type of the actions created by the passed
 * `createAction()`-generated action creator (arbitrary action creators
 * are not supported).
 *
 * @param action The action creator whose action type to get.
 * @returns The action type used by the action creator.
 */
export function getType<T extends string>(
  actionCreator: PayloadActionCreator<any, T>
): T {
  return `${actionCreator}` as T
}
