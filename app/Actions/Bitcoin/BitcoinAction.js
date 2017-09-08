 export const SET_BITCOIN_VALUE = 'SET_BITCOIN_VALUE'

export const setBitcoinValue = (value) => {
  return {
    type: SET_BITCOIN_VALUE,
    payload: value
  }
}