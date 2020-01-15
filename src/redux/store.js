import {createStore, combineReducers, applyMiddleware} from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import ur from './userReducer'

const rootReducer = combineReducers({ur})

export default createStore(rootReducer, applyMiddleware(promiseMiddleware))