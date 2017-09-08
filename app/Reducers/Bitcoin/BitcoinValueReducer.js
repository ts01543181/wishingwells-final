export const BitcoinValueReducer = (state={
  bitcoinValue: ''
}, action) => {
  switch(action.type) {
    case 'SET_BITCOIN_VALUE': {
       return Object.assign({}, state, {
        bitcoinValue: action.payload
      })
    }
    default: {
      return state
    }
  }
}
