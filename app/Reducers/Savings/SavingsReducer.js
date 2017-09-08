export const SavingsReducer = (state={
  entries: []
}, action) => {
  switch(action.type) {
    case 'SAVE_MONEY': {
      return Object.assign({}, state, {
        entries: action.payload
      })
    }
    default: {
      return state
    }
  }
}