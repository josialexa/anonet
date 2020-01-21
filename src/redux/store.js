import {createStore, combineReducers, applyMiddleware} from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import ur from './reducers/userReducer'
import rr from './reducers/roomReducer'
import ir from './reducers/ioReducer'

const rootReducer = combineReducers({ur, rr, ir})

export default createStore(rootReducer, applyMiddleware(promiseMiddleware))