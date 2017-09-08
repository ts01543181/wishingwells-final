export const SAVE_MONEY = 'SAVE_MONEY'

export const setSavings = (entry) => {
  return {
    type: SAVE_MONEY,
    payload: entry
  }
}
