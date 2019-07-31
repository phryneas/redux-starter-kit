import { Action } from 'redux'

/**
 * An action with a string type and an associated payload. This is the
 * type of action returned by `createAction()` action creators.
 *
 * @template P The type of the action's payload.
 * @template T the type used for the action type.
 * @template M The type of the action's meta (optional)
 */
export type PayloadAction<
  P = any,
  T extends string = string,
  M = void
  > = WithOptionalMeta<M, WithPayload<P, Action<T>>>;

export type PrepareAction<P> =
  | ((...args: any[]) => { payload: P })
  | ((...args: any[]) => { payload: P; meta: any })


type ActionCreatorWithPreparedPayload<PA extends PrepareAction<any> | void, T extends string> = PA extends PrepareAction<infer P> ? (...args: Parameters<PA>) => PayloadAction<P, T, MetaOrVoid<PA>> : void;

type ActionCreatorWithOptionalPayload<P, T extends string> = {
  (payload?: undefined): PayloadAction<undefined, T>
  <PT extends Diff<P, undefined>>(payload?: PT): PayloadAction<PT, T>
};

type ActionCreatorWithoutPayload<T extends string> = () => PayloadAction<undefined, T>;

type ActionCreatorWithPayload<P, T extends string> = <PT extends P>(payload: PT) => PayloadAction<PT, T>;

type ActionCreatorWithoutPreparedPayload<P, T extends string> = IfMaybeUndefined<P,
  ActionCreatorWithOptionalPayload<P, T>,
  IfVoid<P,
    ActionCreatorWithoutPayload<T>,
    ActionCreatorWithPayload<P, T>
  >
>;

/**
 * An action creator that produces actions with a `payload` attribute.
 */
export type PayloadActionCreator<
  P = any,
  T extends string = string,
  PA extends PrepareAction<P> | void = void
  > = WithTypeProperty<T,
    IfPrepareActionMethodProvided<PA,
      ActionCreatorWithPreparedPayload<PA, T>,
      ActionCreatorWithoutPreparedPayload<P, T>
    >
  >;

/**
 * A utility function to create an action creator for the given action type
 * string. The action creator accepts a single argument, which will be included
 * in the action object as a field called payload. The action creator function
 * will also have its toString() overriden so that it returns the action type,
 * allowing it to be used in reducer logic that is looking for that action type.
 *
 * @param type The action type to use for created actions.
 * @param prepare (optional) a method that takes any number of arguments and returns { payload } or { payload, meta }.
 *                If this is given, the resulting action creator will pass it's arguments to this method to calculate payload & meta.
 */

export function createAction<P = any, T extends string = string>(
  type: T
): PayloadActionCreator<P, T>

export function createAction<
  PA extends PrepareAction<any>,
  T extends string = string
>(
  type: T,
  prepareAction: PA
): PayloadActionCreator<ReturnType<PA>['payload'], T, PA>

export function createAction(type: string, prepareAction?: Function) {
  function actionCreator(...args: any[]) {
    if (prepareAction) {
      let prepared = prepareAction(...args)
      if (!prepared) {
        throw new Error('prepareAction did not return an object')
      }
      return 'meta' in prepared
        ? { type, payload: prepared.payload, meta: prepared.meta }
        : { type, payload: prepared.payload }
    }
    return { type, payload: args[0] }
  }

  actionCreator.toString = () => `${type}`

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

// helper types for more readable typings

type Diff<T, U> = T extends U ? never : T

type WithPayload<P, T> = T & { payload: P };

type WithOptionalMeta<M, T> = T & ([M] extends [void] ? {} : { meta: M })

type WithTypeProperty<T, MergeIn> = {
  type: T
} & MergeIn;

type IfPrepareActionMethodProvided<PA extends PrepareAction<any> | void, True, False> = PA extends (...args: any[]) => any ? True : False;

type MetaOrVoid<PA extends PrepareAction<any>> = (ReturnType<PA> extends { meta: infer M } ? M : void);

type IfMaybeUndefined<P, True, False> = [undefined] extends [P] ? True : False;

type IfVoid<P, True, False> = [void] extends [P] ? True : False;
