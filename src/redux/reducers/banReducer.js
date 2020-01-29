import axios from 'axios'

const initialState = {
    selectedBan: {},
    selectedUser: {},
    currentBans: [],
    loading: false
}

const SET_CURRENT_BAN = 'SET_CURRENT_BAN'
const SET_CURRENT_USER = 'SET_CURRENT_USER'
const GET_CURRENT_BANS = 'GET_CURRENT_BANS'
const CREATE_BAN = 'CREATE_BAN'
const UPDATE_BAN = 'UPDATE_BAN'
const DELETE_BAN = 'DELETE_BAN'

export const setCurrentUser = user => {
    return {
        type: SET_CURRENT_USER,
        payload: user
    }
}

export const setCurrentBan = ban => {
    return {
        type: SET_CURRENT_BAN,
        payload: ban
    }
}

export const getCurrentBans = room => {
    return {
        type: GET_CURRENT_BANS,
        payload: axios.get(`/api/bans`)
    }
}

export const createBan = ban => {
    return {
        type: CREATE_BAN,
        payload: axios.post('/api/bans', ban)
    }
}

export const updateBan = ban => {
    return {
        type: UPDATE_BAN,
        payload: axios.put(`/api/bans/${ban.id}`, ban)
    }
}

export const deleteBan = ban => {
    return {
        type: DELETE_BAN,
        payload: axios.delete(`/api/bans/${ban.id}`)
    }
}

export default function reducer(state = initialState, action) {
    const {type, payload} = action

    switch(type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                selectedUser: payload
            }
        case SET_CURRENT_BAN:
            return {
                ...state,
                selectedBan: payload
            }
        case `${GET_CURRENT_BANS}_PENDING`:
            return {
                ...state,
                loading: true
            }
        case `${GET_CURRENT_BANS}_FULFILLED`:
            return {
                ...state,
                currentBans: payload.data,
                loading: false
            }
        case `${CREATE_BAN}_PENDING`:
            return {
                ...state,
                loading: true
            }
        case `${CREATE_BAN}_FULFILLED`:
            return {
                ...state,
                loading: false
            }
        case `${UPDATE_BAN}_PENDING`:
            return {
                ...state,
                loading: true
            }
        case `${UPDATE_BAN}_FULFILLED`:
            return {
                ...state,
                loading: false
            }
        case `${DELETE_BAN}_PENDING`:
            return {
                ...state,
                loading: true
            }
        case `${DELETE_BAN}_FULFILLED`:
            return {
                ...state,
                loading: false
            }
        default: return state
    }
}