import { Action } from 'redux';
import { AnyAction } from 'redux';
import { default as createNextState } from 'immer';
import { createSelector } from 'reselect';
import { DeepPartial } from 'redux';
import { Draft } from 'immer';
import { EnhancerOptions } from 'redux-devtools-extension';
import { Middleware } from 'redux';
import { Reducer } from 'redux';
import { ReducersMapObject } from 'redux';
import { Store } from 'redux';
import { StoreEnhancer } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

/* Excluded from this release type: ActionCreatorForCaseReducer */

/* Excluded from this release type: ActionCreatorForCaseReducerWithPrepare */

/**
 * An action creator of type `T` whose `payload` type could not be inferred. Accepts everything as `payload`.
 *
 * @public
 */
export declare interface ActionCreatorWithNonInferrablePayload<T extends string = string> extends BaseActionCreator<unknown, T> {
    <PT extends unknown>(payload: PT): PayloadAction<PT, T>;
}

/**
 * An action creator of type `T` that takes an optional payload of type `P`.
 *
 * @public
 */
export declare interface ActionCreatorWithOptionalPayload<P, T extends string = string> extends BaseActionCreator<P, T> {
    (payload?: undefined): PayloadAction<undefined, T>;
    <PT extends Diff<P, undefined>>(payload?: PT): PayloadAction<PT, T>;
}

/**
 * An action creator of type `T` that takes no payload.
 *
 * @public
 */
export declare interface ActionCreatorWithoutPayload<T extends string = string> extends BaseActionCreator<undefined, T> {
    (): PayloadAction<undefined, T>;
}

/**
 * An action creator of type `T` that requires a payload of type P.
 *
 * @public
 */
export declare interface ActionCreatorWithPayload<P, T extends string = string> extends BaseActionCreator<P, T> {
    <PT extends P>(payload: PT): PayloadAction<PT, T>;
    (payload: P): PayloadAction<P, T>;
}

/**
 * An action creator that takes multiple arguments that are passed to a `PrepareAction` method to create the final Action.
 * @typeParam Args arguments for the action creator function
 * @typeParam P `payload` type
 * @typeParam T `type` name
 * @typeParam E optional `error` type
 * @typeParam M optional `meta` type
 *
 * @public
 */
export declare interface ActionCreatorWithPreparedPayload<Args extends unknown[], P, T extends string = string, E = never, M = never> extends BaseActionCreator<P, T, M, E> {
    (...args: Args): PayloadAction<P, T, M, E>;
}

/* Excluded from this release type: _ActionCreatorWithPreparedPayload */

/**
 * A builder for an action <-> reducer map.
 */
export declare interface ActionReducerMapBuilder<State> {
    /**
     * Add a case reducer for actions created by this action creator.
     * @param actionCreator
     * @param reducer
     */
    addCase<ActionCreator extends TypedActionCreator<string>>(actionCreator: ActionCreator, reducer: CaseReducer<State, ReturnType<ActionCreator>>): ActionReducerMapBuilder<State>;
    /**
     * Add a case reducer for actions with the specified type.
     * @param type
     * @param reducer
     */
    addCase<Type extends string, A extends Action<Type>>(type: Type, reducer: CaseReducer<State, A>): ActionReducerMapBuilder<State>;
}

/**
 * Defines a mapping from action types to corresponding action object shapes.
 */
export declare type Actions<T extends keyof any = string> = Record<T, Action>;

/* Excluded from this release type: AtLeastTS35 */

/**
 * Basic type for all action creators.
 */
declare interface BaseActionCreator<P, T extends string, M = never, E = never> {
    type: T;
    match(action: Action<unknown>): action is PayloadAction<P, T, M, E>;
}

/**
 * An *case reducer* is a reducer function for a specific action type. Case
 * reducers can be composed to full reducers using `createReducer()`.
 *
 * Unlike a normal Redux reducer, a case reducer is never called with an
 * `undefined` state to determine the initial state. Instead, the initial
 * state is explicitly specified as an argument to `createReducer()`.
 *
 * In addition, a case reducer can choose to mutate the passed-in `state`
 * value directly instead of returning a new state. This does not actually
 * cause the store state to be mutated directly; instead, thanks to
 * [immer](https://github.com/mweststrate/immer), the mutations are
 * translated to copy operations that result in a new state.
 */
export declare type CaseReducer<S = any, A extends Action = AnyAction> = (state: Draft<S>, action: A) => S | void;

/**
 * Derives the slice's `actions` property from the `reducers` options
 *
 * @public
 */
export declare type CaseReducerActions<CaseReducers extends SliceCaseReducerDefinitions<any, any>> = {
    [Type in keyof CaseReducers]: CaseReducers[Type] extends {
        prepare: any;
    } ? ActionCreatorForCaseReducerWithPrepare<CaseReducers[Type]> : ActionCreatorForCaseReducer<CaseReducers[Type]>;
};

/**
 * A mapping from action types to case reducers for `createReducer()`.
 */
export declare type CaseReducers<S, AS extends Actions> = {
    [T in keyof AS]: AS[T] extends Action ? CaseReducer<S, AS[T]> : void;
};

/**
 * A CaseReducer with a `prepare` method.
 *
 * @public
 */
export declare type CaseReducerWithPrepare<State, Action extends PayloadAction> = {
    reducer: CaseReducer<State, Action>;
    prepare: PrepareAction<Action['payload']>;
};

export declare type ConfigureEnhancersCallback = (defaultEnhancers: StoreEnhancer[]) => StoreEnhancer[];

/**
 * A friendly abstraction over the standard Redux `createStore()` function.
 *
 * @param config The store configuration.
 * @returns A configured Redux store.
 */
export declare function configureStore<S = any, A extends Action = AnyAction>(options: ConfigureStoreOptions<S, A>): EnhancedStore<S, A>;

/**
 * Options for `configureStore()`.
 */
export declare interface ConfigureStoreOptions<S = any, A extends Action = AnyAction> {
    /**
     * A single reducer function that will be used as the root reducer, or an
     * object of slice reducers that will be passed to `combineReducers()`.
     */
    reducer: Reducer<S, A> | ReducersMapObject<S, A>;
    /**
     * An array of Redux middleware to install. If not supplied, defaults to
     * the set of middleware returned by `getDefaultMiddleware()`.
     */
    middleware?: Middleware<{}, S>[];
    /**
     * Whether to enable Redux DevTools integration. Defaults to `true`.
     *
     * Additional configuration can be done by passing Redux DevTools options
     */
    devTools?: boolean | EnhancerOptions;
    /**
     * The initial state, same as Redux's createStore.
     * You may optionally specify it to hydrate the state
     * from the server in universal apps, or to restore a previously serialized
     * user session. If you use `combineReducers()` to produce the root reducer
     * function (either directly or indirectly by passing an object as `reducer`),
     * this must be an object with the same shape as the reducer map keys.
     */
    preloadedState?: DeepPartial<S extends any ? S : S>;
    /**
     * The store enhancers to apply. See Redux's `createStore()`.
     * All enhancers will be included before the DevTools Extension enhancer.
     * If you need to customize the order of enhancers, supply a callback
     * function that will receive the original array (ie, `[applyMiddleware]`),
     * and should return a new array (such as `[applyMiddleware, offline]`).
     * If you only need to add middleware, you can use the `middleware` parameter instaead.
     */
    enhancers?: StoreEnhancer[] | ConfigureEnhancersCallback;
}

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
export declare function createAction<P = void, T extends string = string>(type: T): PayloadActionCreator<P, T>;

export declare function createAction<PA extends PrepareAction<any>, T extends string = string>(type: T, prepareAction: PA): PayloadActionCreator<ReturnType<PA>['payload'], T, PA>;
export { createNextState }

/**
 * A utility function that allows defining a reducer as a mapping from action
 * type to *case reducer* functions that handle these action types. The
 * reducer's initial state is passed as the first argument.
 *
 * The body of every case reducer is implicitly wrapped with a call to
 * `produce()` from the [immer](https://github.com/mweststrate/immer) library.
 * This means that rather than returning a new state object, you can also
 * mutate the passed-in state object directly; these mutations will then be
 * automatically and efficiently translated into copies, giving you both
 * convenience and immutability.
 *
 * @param initialState The initial state to be returned by the reducer.
 * @param actionsMap A mapping from action types to action-type-specific
 *   case reducers.
 */
export declare function createReducer<S, CR extends CaseReducers<S, any> = CaseReducers<S, any>>(initialState: S, actionsMap: CR): Reducer<S>;

/**
 * A utility function that allows defining a reducer as a mapping from action
 * type to *case reducer* functions that handle these action types. The
 * reducer's initial state is passed as the first argument.
 *
 * The body of every case reducer is implicitly wrapped with a call to
 * `produce()` from the [immer](https://github.com/mweststrate/immer) library.
 * This means that rather than returning a new state object, you can also
 * mutate the passed-in state object directly; these mutations will then be
 * automatically and efficiently translated into copies, giving you both
 * convenience and immutability.
 * @param initialState The initial state to be returned by the reducer.
 * @param builderCallback A callback that receives a *builder* object to define
 *   case reducers via calls to `builder.addCase(actionCreatorOrType, reducer)`.
 */
export declare function createReducer<S>(initialState: S, builderCallback: (builder: ActionReducerMapBuilder<S>) => void): Reducer<S>;
export { createSelector }

/**
 * Creates a middleware that, after every state change, checks if the new
 * state is serializable. If a non-serializable value is found within the
 * state, an error is printed to the console.
 *
 * @param options Middleware options.
 */
export declare function createSerializableStateInvariantMiddleware(options?: SerializableStateInvariantMiddlewareOptions): Middleware;

/**
 * A function that accepts an initial state, an object full of reducer
 * functions, and a "slice name", and automatically generates
 * action creators and action types that correspond to the
 * reducers and state.
 *
 * The `reducer` argument is passed to `createReducer()`.
 */
export declare function createSlice<State, CaseReducers extends SliceCaseReducerDefinitions<State, CaseReducers>>(options: CreateSliceOptions<State, CaseReducers>): Slice<State, CaseReducers>;

/**
 * Options for `createSlice()`.
 *
 * @public
 */
export declare interface CreateSliceOptions<State = any, CR extends SliceCaseReducerDefinitions<State, any> = SliceCaseReducerDefinitions<State, any>> {
    /**
     * The slice's name. Used to namespace the generated action types.
     */
    name: string;
    /**
     * The initial state to be returned by the slice reducer.
     */
    initialState: State;
    /**
     * A mapping from action types to action-type-specific *case reducer*
     * functions. For every action type, a matching action creator will be
     * generated using `createAction()`.
     */
    reducers: CR;
    /**
     * A mapping from action types to action-type-specific *case reducer*
     * functions. These reducers should have existing action types used
     * as the keys, and action creators will _not_ be generated.
     * Alternatively, a callback that receives a *builder* object to define
     * case reducers via calls to `builder.addCase(actionCreatorOrType, reducer)`.
     */
    extraReducers?: CaseReducers<NoInfer<State>, any> | ((builder: ActionReducerMapBuilder<NoInfer<State>>) => void);
}

declare type Diff<T, U> = T extends U ? never : T;

/**
 * A Redux store returned by `configureStore()`. Supports dispatching
 * side-effectful _thunks_ in addition to plain actions.
 */
export declare interface EnhancedStore<S = any, A extends Action = AnyAction> extends Store<S, A> {
    dispatch: ThunkDispatch<S, any, A>;
}

export declare function findNonSerializableValue(value: unknown, path?: ReadonlyArray<string>, isSerializable?: (value: unknown) => boolean, getEntries?: (value: unknown) => [string, any][]): NonSerializableValue | false;

/**
 * Returns any array containing the default middleware installed by
 * `configureStore()`. Useful if you want to configure your store with a custom
 * `middleware` array but still keep the default set.
 *
 * @return The default middleware used by `configureStore()`.
 */
export declare function getDefaultMiddleware<S = any>(options?: GetDefaultMiddlewareOptions): Middleware<{}, S>[];

declare interface GetDefaultMiddlewareOptions {
    thunk?: boolean | ThunkOptions;
    immutableCheck?: boolean | ImmutableStateInvariantMiddlewareOptions;
    serializableCheck?: boolean | SerializableStateInvariantMiddlewareOptions;
}

/**
 * Returns the action type of the actions created by the passed
 * `createAction()`-generated action creator (arbitrary action creators
 * are not supported).
 *
 * @param action The action creator whose action type to get.
 * @returns The action type used by the action creator.
 */
export declare function getType<T extends string>(actionCreator: PayloadActionCreator<any, T>): T;

/* Excluded from this release type: IfMaybeUndefined */

declare type IfPrepareActionMethodProvided<PA extends PrepareAction<any> | void, True, False> = PA extends (...args: any[]) => any ? True : False;

/* Excluded from this release type: IfVoid */

declare interface ImmutableStateInvariantMiddlewareOptions {
    isImmutable?: (value: any) => boolean;
    ignore?: string[];
}

/* Excluded from this release type: IsAny */

/* Excluded from this release type: IsEmptyObj */

/**
 * Returns true if the passed value is "plain", i.e. a value that is either
 * directly JSON-serializable (boolean, number, string, array, plain object)
 * or `undefined`.
 *
 * @param val The value to check.
 */
export declare function isPlain(val: any): boolean;

/* Excluded from this release type: IsUnknown */

/* Excluded from this release type: IsUnknownOrNonInferrable */

/* Excluded from this release type: NoInfer */

declare interface NonSerializableValue {
    keyPath: string;
    value: unknown;
}

/**
 * An action with a string type and an associated payload. This is the
 * type of action returned by `createAction()` action creators.
 *
 * @template P The type of the action's payload.
 * @template T the type used for the action type.
 * @template M The type of the action's meta (optional)
 * @template E The type of the action's error (optional)
 *
 * @public
 */
export declare type PayloadAction<P = void, T extends string = string, M = never, E = never> = {
    payload: P;
    type: T;
} & ([M] extends [never] ? {} : {
    meta: M;
}) & ([E] extends [never] ? {} : {
    error: E;
});

/**
 * An action creator that produces actions with a `payload` attribute.
 *
 * @typeParam P the `payload` type
 * @typeParam T the `type` of the resulting action
 * @typeParam PA if the resulting action is preprocessed by a `prepare` method, the signature of said method.
 *
 * @public
 */
export declare type PayloadActionCreator<P = void, T extends string = string, PA extends PrepareAction<P> | void = void> = IfPrepareActionMethodProvided<PA, _ActionCreatorWithPreparedPayload<PA, T>, IsAny<P, ActionCreatorWithPayload<any, T>, IsUnknownOrNonInferrable<P, ActionCreatorWithNonInferrablePayload<T>, IfVoid<P, ActionCreatorWithoutPayload<T>, IfMaybeUndefined<P, ActionCreatorWithOptionalPayload<P, T>, ActionCreatorWithPayload<P, T>>>>>>;

/**
 * A "prepare" method to be used as the second parameter of `createAction`.
 * Takes any number of arguments and returns a Flux Standard Action without
 * type (will be added later) that *must* contain a payload (might be undefined).
 *
 * @public
 */
export declare type PrepareAction<P> = ((...args: any[]) => {
    payload: P;
}) | ((...args: any[]) => {
    payload: P;
    meta: any;
}) | ((...args: any[]) => {
    payload: P;
    error: any;
}) | ((...args: any[]) => {
    payload: P;
    meta: any;
    error: any;
});

/**
 * Options for `createSerializableStateInvariantMiddleware()`.
 */
export declare interface SerializableStateInvariantMiddlewareOptions {
    /**
     * The function to check if a value is considered serializable. This
     * function is applied recursively to every value contained in the
     * state. Defaults to `isPlain()`.
     */
    isSerializable?: (value: any) => boolean;
    /**
     * The function that will be used to retrieve entries from each
     * value.  If unspecified, `Object.entries` will be used. Defaults
     * to `undefined`.
     */
    getEntries?: (value: any) => [string, any][];
    /**
     * An array of action types to ignore when checking for serializability, Defaults to []
     */
    ignoredActions?: string[];
}

/**
 * The return value of `createSlice`
 *
 * @public
 */
export declare interface Slice<State = any, CaseReducers extends SliceCaseReducerDefinitions<State, any> = {
    [key: string]: any;
}> {
    /**
     * The slice name.
     */
    name: string;
    /**
     * The slice's reducer.
     */
    reducer: Reducer<State>;
    /**
     * Action creators for the types of actions that are handled by the slice
     * reducer.
     */
    actions: CaseReducerActions<CaseReducers>;
    /**
     * The reducers defined by `reducers` for easy access if they were defined inline when calling createSlice.
     */
    caseReducers: SliceDefinedCaseReducers<CaseReducers>;
}

/**
 * An action creator atttached to a slice.
 *
 * @deprecated please use PayloadActionCreator directly
 */
export declare type SliceActionCreator<P> = PayloadActionCreator<P>;

/**
 * The type describing a slice's `reducers` option.
 * Also checks itself, so it has to be passed "itself" as it's second option.
 * See the method signature of `createSlice`.
 *
 * @public
 */
export declare type SliceCaseReducerDefinitions<State, CR> = {
    [K: string]: CaseReducer<State, PayloadAction<any>> | CaseReducerWithPrepare<State, PayloadAction<any>>;
} & SliceCaseReducersCheck<State, CR>;

/* Excluded from this release type: SliceCaseReducersCheck */

/* Excluded from this release type: SliceDefinedCaseReducers */

declare interface ThunkOptions<E = any> {
    extraArgument: E;
}

declare interface TypedActionCreator<Type extends string> {
    (...args: any[]): Action<Type>;
    type: Type;
}

export * from "redux";

export { }
