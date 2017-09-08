export const PhotoReducer = (state={
  photo: ''
}, action) => {
  switch(action.type) {
    case 'SET_USERPHOTO': {
       return Object.assign({}, state, {
        photo: action.payload
      })
    }
    default: {
      return state
    }
  }
}
