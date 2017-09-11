export const SavingsReducer = (state={
  entries: [],
  wellEntries: []
}, action) => {
  switch(action.type) {
    case 'SAVE_MONEY': {
      return Object.assign({}, state, {
        entries: action.payload,
        wellEntries: action.payload,
      })
    }
    default: {
      return state
    }
  }
}
