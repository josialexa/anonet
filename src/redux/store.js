import {createStore, combineReducers, applyMiddleware} from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import ur from './reducers/userReducer'
import rr from './reducers/roomReducer'
import ir from './reducers/ioReducer'
import br from './reducers/banReducer'
import mr from './reducers/moderatorReducer'

const rootReducer = combineReducers({ur, rr, ir, br, mr})

export default createStore(rootReducer, applyMiddleware(promiseMiddleware))