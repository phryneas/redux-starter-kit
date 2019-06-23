import {
  AnyAction,
  createSlice,
  PayloadAction,
  Reducer,
  createAction
} from 'redux-starter-kit'

/*
 * Test: createSlice() infers the returned slice's type.
 */
{
  const firstAction = createAction<{ count: number }>('FIRST_ACTION')

  const slice = createSlice({
    slice: 'counter',
    initialState: 0,
    reducers: {
      increment: (state: number, action) => state + action.payload,
      decrement: (state: number, action) => state - action.payload
    },
    extraReducers: {
      [firstAction.type]: (state: number, action) =>
        state + action.payload.count
    }
  })

  /* Reducer */

  const reducer: Reducer<number, PayloadAction> = slice.reducer

  // typings:expect-error
  const stringReducer: Reducer<string, PayloadAction> = slice.reducer
  // typings:expect-error
  const anyActionReducer: Reducer<string, AnyAction> = slice.reducer

  /* Actions */

  slice.actions.increment(1)
  slice.actions.decrement(1)

  // typings:expect-error
  slice.actions.other(1)

  /* Selector */

  const value: number = slice.selectors.getCounter(0)

  // typings:expect-error
  const stringValue: string = slice.selectors.getCounter(0)
}

/*
 * Test: Slice action creator types are inferred.
 */
{
  const counter = createSlice({
    slice: 'counter',
    initialState: 0,
    reducers: {
      increment: state => state + 1,
      decrement: state => state - 1,
      multiply: (state, action: PayloadAction<number>) => state * action.payload
    }
  })

  counter.actions.increment()
  counter.actions.multiply(2)

  // typings:expect-error
  counter.actions.multiply()

  // typings:expect-error
  counter.actions.multiply('2')
}

/*
 * Test: Slice action creator types are inferred for enhanced reducers.
 */
{
  const counter = createSlice({
    slice: 'counter',
    initialState: 0,
    reducers: {
      strLen: {
        reducer: s => s,
        payloadCreator: (payload: string) => payload.length
      },
      strLenMeta: {
        reducer: s => s,
        metaCreator: (payload: string) => payload.length
      }
    }
  })

  const n1: number = counter.actions.strLen('test').payload
  const s1: string = counter.actions.strLenMeta('test').payload
  const n2: number = counter.actions.strLenMeta('test').meta

  // typings:expect-error
  const s2: string = counter.actions.strLen('test').payload

  // typings:expect-error
  const s3: string = counter.actions.strLenMeta('test').meta
}
