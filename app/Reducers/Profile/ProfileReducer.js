export const ProfileReducer = (state={
  username: '',
  firstname: '',
  lastname: '',
  email: '',
  bio: '',
  uid: '',
  qr: '',
  cardID: '',
  total: 0,
  goal: 0,
  donationID: '',
}, action) => {
  switch(action.type) {
    case 'SET_USERINFO': {
      return Object.assign({}, state, {
        username: action.payload.username || state.username,
        firstname: action.payload.firstname || state.firstname,
        lastname: action.payload.lastname || state.lastname,
        email: action.payload.email || state.email,
        bio: action.payload.bio || state.bio,
        uid: action.payload.uid || state.uid,
        qr: action.payload.qr || state.qr,
        cardID: action.payload.cardID || state.cardID,
        total: action.payload.total || state.total,
        goal: action.payload.goal || state.goal,
        donationID: action.payload.donationID || state.donationID,
      })
    }
    default: {
      return state
    }
  }
}
