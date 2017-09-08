export const SET_USERPHOTO = 'SET_USERPHOTO'

export const setUserPhoto = (value) => {
  return {
    type: SET_USERPHOTO,
    payload: value
  }
}