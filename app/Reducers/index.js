import { combineReducers } from 'redux';
import { ProfileReducer } from './Profile/ProfileReducer'
import { PhotoReducer } from './Profile/PhotoReducer'
import { SavingsReducer } from './Savings/SavingsReducer'
import { BitcoinValueReducer } from './Bitcoin/BitcoinValueReducer'

const reducers = combineReducers({
  ProfileReducer,
  PhotoReducer,
  SavingsReducer,
  BitcoinValueReducer
})

export default reducers;