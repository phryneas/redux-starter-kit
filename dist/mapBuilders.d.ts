import { Action } from 'redux';
import { CaseReducer, CaseReducers } from './createReducer';
export interface TypedActionCreator<Type extends string> {
    (...args: any[]): Action<Type>;
    type: Type;
}
/**
 * A builder for an action <-> reducer map.
 */
export interface ActionReducerMapBuilder<State> {
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
export declare function executeReducerBuilderCallback<S>(builderCallback: (builder: ActionReducerMapBuilder<S>) => void): CaseReducers<S, any>;
