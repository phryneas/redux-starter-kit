import { Reducer } from 'redux'
import {
  createAction,
  PayloadAction,
  CreatedAction,
  PayloadCreator,
  MetaCreator,
  PayloadActionCreator
} from './createAction'
import { createReducer, CaseReducers, CaseReducer } from './createReducer'
import { createSliceSelector, createSelectorName } from './sliceSelector'

/**
 * An action creator atttached to a slice.
 */
export type SliceActionCreator<P> = P extends void
  ? () => PayloadAction<void>
  : (payload: P) => PayloadAction<P>

export interface Slice<
  S = any,
  AC extends CaseReducerActionCreators<any> = any
> {
  /**
   * The slice name.
   */
  slice: string

  /**
   * The slice's reducer.
   */
  reducer: Reducer<S>

  /**
   * Action creators for the types of actions that are handled by the slice
   * reducer.
   */
  actions: AC

  /**
   * Selectors for the slice reducer state. `createSlice()` inserts a single
   * selector that returns the entire slice state and whose name is
   * automatically derived from the slice name (e.g., `getCounter` for a slice
   * named `counter`).
   */
  selectors: { [key: string]: (state: any) => S }
}

interface ComplexReducerDefinition<
  S,
  T extends string = string,
  A extends any[] = [any],
  P = A[0],
  M = void
> {
  reducer: CaseReducer<S, CreatedAction<P, M, T>>
  payloadCreator?: PayloadCreator<A, P>
  metaCreator?: MetaCreator<A, M>
}

type ActionForComplexReducer<
  D extends ComplexReducerDefinition<any, string, any, any, any>,
  T extends string = string
> = D['payloadCreator'] extends (...args: infer A) => infer P
  ? (D['metaCreator'] extends (...args: any) => infer M
      ? PayloadActionCreator<P, T, A, M>
      : PayloadActionCreator<P, T, A>)
  : Parameters<D['reducer']>[1] extends { payload: infer P }
  ? (D['metaCreator'] extends (...args: any) => infer M
      ? PayloadActionCreator<P, T, [P], M>
      : PayloadActionCreator<P, T, [P]>)
  : (D['metaCreator'] extends (...args: infer A) => infer M
      ? PayloadActionCreator<A[0], T, A, M>
      : PayloadActionCreator<void, T, [void?]>)

type SliceReducers<S> = Record<
  string,
  CaseReducer<S, any> | ComplexReducerDefinition<S, string, any, any, any>
>

/**
 * Options for `createSlice()`.
 */
export interface CreateSliceOptions<
  S = any,
  SR extends SliceReducers<S> = SliceReducers<S>
> {
  /**
   * The slice's name. Used to namespace the generated action types and to
   * name the selector for retrieving the reducer's state.
   */
  slice?: string

  /**
   * The initial state to be returned by the slice reducer.
   */
  initialState: S

  /**
   * A mapping from action types to action-type-specific *case reducer*
   * functions. For every action type, a matching action creator will be
   * generated using `createAction()`.
   */
  reducers: SR

  /**
   * A mapping from action types to action-type-specific *case reducer*
   * functions. These reducers should have existing action types used
   * as the keys, and action creators will _not_ be generated.
   */
  extraReducers?: CaseReducers<S, any>
}

type ActionFor<
  S,
  T extends string,
  R extends
    | CaseReducer<S, any>
    | ComplexReducerDefinition<S, string, any, any, any>
> = R extends ComplexReducerDefinition<any, string, any, any, any>
  ? ActionForComplexReducer<R, T>
  : (R extends (state: any) => any
      ? PayloadActionCreator<void, T>
      : R extends (state: any, action: PayloadAction<infer P>) => any
      ? PayloadActionCreator<P, T>
      : PayloadActionCreator<void, T>)

type CaseReducerActionCreators<SR extends SliceReducers<any>> = {
  [T in keyof SR]: T extends string
    ? ActionFor<any, T, SR[T]>
    : ActionFor<any, string, SR[T]>
}

function getType(slice: string, actionKey: string): string {
  return slice ? `${slice}/${actionKey}` : actionKey
}

/**
 * A function that accepts an initial state, an object full of reducer
 * functions, and optionally a "slice name", and automatically generates
 * action creators, action types, and selectors that correspond to the
 * reducers and state.
 *
 * The `reducer` argument is passed to `createReducer()`.
 */
export function createSlice<S, CR extends SliceReducers<S>>(
  options: CreateSliceOptions<S, CR>
): Slice<S, CaseReducerActionCreators<CR>> {
  const { slice = '', initialState } = options
  const reducers = options.reducers || {}
  const extraReducers = options.extraReducers || {}
  const actionKeys = Object.keys(reducers)

  const reducerMap = actionKeys.reduce((map, actionKey) => {
    const reducer = reducers[actionKey]
    map[getType(slice, actionKey)] =
      typeof reducer === 'function' ? reducer : reducer.reducer
    return map
  }, extraReducers)

  const reducer = createReducer(initialState, reducerMap)

  const actionMap = actionKeys.reduce(
    (map, action) => {
      const type = getType(slice, action)
      const reducer = reducers[action]
      if (typeof reducer === 'function') {
        map[action] = createAction(type)
      } else {
        map[action] = createAction(
          type,
          reducer.payloadCreator,
          reducer.metaCreator
        )
      }
      return map
    },
    {} as any
  )

  const selectors = {
    [createSelectorName(slice)]: createSliceSelector(slice)
  }

  return {
    slice,
    reducer,
    actions: actionMap,
    selectors
  }
}
