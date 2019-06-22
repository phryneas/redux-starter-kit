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

export type PayloadMetaAction<P = any, M = any, T extends string = string> = ([
  M
] extends [never]
  ? {}
  : { meta: M }) &
  PayloadAction<P, T>

export type PrepareAction<
  OriginalPayload = any,
  TargetPayload = OriginalPayload,
  Meta = never
> = (
  payload: OriginalPayload
) => [Meta] extends [never]
  ? { payload: TargetPayload }
  : { payload: TargetPayload; meta: Meta }

/**
 * An action creator that produces actions with a `payload` attribute.
 */
export interface PayloadActionCreator<
  P = any,
  T extends string = string,
  Prepare extends PrepareAction<P, any> = PrepareAction<P, P>
> {
  (): Action<T>
  (payload: P): Prepare extends PrepareAction<any, infer TP, infer M>
    ? PayloadMetaAction<TP, M, T>
    : Prepare extends PrepareAction<any, infer TP>
    ? PayloadMetaAction<TP>
    : never
  type: T
}

/**
 * A utility function to create an action creator for the given action type
 * string. The action creator accepts a single argument, which will be included
 * in the action object as a field called payload. The action creator function
 * will also have its toString() overriden so that it returns the action type,
 * allowing it to be used in reducer logic that is looking for that action type.
 *
 * @param type The action type to use for created actions.
 */
export function createAction<
  P = any,
  T extends string = string,
  Prepare extends PrepareAction<P> = PrepareAction<P, P>
>(type: T, prepareAction?: Prepare): PayloadActionCreator<P, T, Prepare> {
  //function actionCreator(): Action<T>
  //function actionCreator(payload: P): ActionTypeFor<Prepare, T>
  function actionCreator(payload?: P): any {
    if (prepareAction) {
      return {
        ...prepareAction(
          payload! /* TODO: this does not match up with the current signature */
        ),
        type
      }
    }
    return { type, payload }
  }

  actionCreator.toString = (): T => `${type}` as T

  actionCreator.type = type

  return actionCreator as any
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
