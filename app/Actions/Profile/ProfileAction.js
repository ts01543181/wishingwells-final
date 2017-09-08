export const SET_USERINFO = 'SET_USERINFO'

export const setUserInfo = (user) => {
  return {
    type: SET_USERINFO,
    payload: user
  }
}
