import {
  createAction,
  PayloadAction,
  ActionCreator,
  PayloadActionCreator,
  Action,
  AnyAction
} from 'redux-starter-kit'

function expectType<T>(p: T) { }

/* PayloadAction */

/*
 * Test: PayloadAction has type parameter for the payload.
 */
{
  const action: PayloadAction<number> = { type: '', payload: 5 }
  const numberPayload: number = action.payload

  // typings:expect-error
  const stringPayload: string = action.payload
}

/*
 * Test: PayloadAction type parameter is optional (defaults to `any`).
 */
{
  const action: PayloadAction = { type: '', payload: 5 }
  const numberPayload: number = action.payload
  const stringPayload: string = action.payload
}

/*
 * Test: PayloadAction has a string type tag.
 */
{
  const action: PayloadAction = { type: '', payload: 5 }

  // typings:expect-error
  const action2: PayloadAction = { type: 1, payload: 5 }
}

/*
 * Test: PayloadAction is compatible with Action<string>
 */
{
  const action: PayloadAction = { type: '', payload: 5 }
  const stringAction: Action<string> = action
}

/* PayloadActionCreator */

/*
 * Test: PayloadActionCreator returns correctly typed PayloadAction depending
 * on whether a payload is passed.
 */
{
  const actionCreator = Object.assign(
    (payload?: number) => ({
      type: 'action',
      payload
    }),
    { type: 'action' }
  ) as PayloadActionCreator

  expectType<PayloadAction<number>>(actionCreator(1));
  expectType<PayloadAction<undefined>>(actionCreator());
  expectType<PayloadAction<undefined>>(actionCreator(undefined));

  // typings:expect-error
  expectType<PayloadAction<number>>(actionCreator());
  // typings:expect-error
  expectType<PayloadAction<undefined>>(actionCreator(1));
}

/*
 * Test: PayloadActionCreator is compatible with ActionCreator.
 */
{
  const payloadActionCreator = Object.assign(
    (payload?: number) => ({
      type: 'action',
      payload
    }),
    { type: 'action' }
  ) as PayloadActionCreator
  const actionCreator: ActionCreator<AnyAction> = payloadActionCreator

  const payloadActionCreator2 = Object.assign(
    (payload?: number) => ({
      type: 'action',
      payload: payload || 1
    }),
    { type: 'action' }
  ) as PayloadActionCreator<number>

  const actionCreator2: ActionCreator<
    PayloadAction<number>
  > = payloadActionCreator2
}

/* createAction() */

/*
 * Test: createAction() has type parameter for the action payload.
 */
{
  const increment = createAction<number, 'increment'>('increment')
  const n: number = increment(1).payload

  // typings:expect-error
  increment("").payload
}

/*
 * Test: createAction() type parameter is optional (defaults to `any`).
 */
{
  const increment = createAction('increment')
  const n: number = increment(1).payload
  const s: string = increment("1").payload

  // but infers the payload type to be the argument type
  // typings:expect-error
  const t: string = increment(1).payload
}
/*
 * Test: createAction().type is a string literal.
 */
{
  const increment = createAction('increment')
  const n: string = increment(1).type
  const s: 'increment' = increment(1).type

  // typings:expect-error
  const r: 'other' = increment(1).type
  // typings:expect-error
  const q: number = increment(1).type
}
