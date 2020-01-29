import axios from 'axios'

const initialState = {
    // message: '',
    file: null,
    id: null,
    username: '',
    primaryColor: '',
    profileImgUrl: '',
    // io: null,
    // rooms: [],
    loading: false
}

const UPDATE_USER_DATA = 'UPDATE_USER_DATA'
const SET_USER_ID = 'SET_USER_ID'
const UPDATE_SETTINGS = 'UPDATE_SETTINGS'
const REGISTER_USER = 'REGISTER_USER'
const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'
const DELETE_USER = 'DELETE_USER'
const GET_USER_MODS_BANS = 'GET_USER_MODS_BANS'
// const UPDATE_MESSAGE = 'UPDATE_MESSAGE'
// const UPDATE_FILE = 'UPDATE_FILE'
// const SET_IO = 'SET_IO'
// const JOIN_ROOM = 'JOIN_ROOM'
// const LEAVE_ROOM = 'LEAVE_ROOM'

export const updateUserData = id => {
    return {
        type: UPDATE_USER_DATA,
        payload: axios.get(`/api/users/${id}`)
    }
}

export const setUserId = id => {
    return {
        type: SET_USER_ID,
        payload: id
    }
}

export const updateSettings = user => {
    return {
        type: UPDATE_SETTINGS,
        payload: axios.put('/api/users', user)
    }
}

export const registerUser = (username, password) => {
    return {
        type: REGISTER_USER,
        payload: axios.post('/auth/register', {username, password})
    }
}

export const login = () => {

}

export const logout = () => {
    return {
        type: LOGOUT,
        payload: axios.get('/auth/logout')
    }
}

export const deleteUser = id => {
    return {
        type: DELETE_USER,
        payload: axios.delete(`/api/users/${id}`)
    }
}

export const getUserModsBans = user => {
    return {
        type: GET_USER_MODS_BANS,
        payload: axios.get(`/api/users/modsBans?id=${user.id}`)
    }
}

// export const setIo = io => {
//     return {
//         type: SET_IO,
//         payload: io
//     }
// }

// export const joinRoom = room => {
//     return {
//         type: JOIN_ROOM,
//         payload: room
//     }
// }

export default function reducer(state = initialState, action) {
    const {type, payload} = action

    switch(type) {
        case `${UPDATE_USER_DATA}_FULFILLED`:
            const userData = payload.data
            console.log(userData)
            return {
                ...state,
                id: userData.id,
                username: userData.username,
                primaryColor: userData.primaryColor,
                profileImgUrl: userData.profileImgUrl,
                loading: false
            }
        case `${UPDATE_USER_DATA}_PENDING`:
            return {
                ...state,
                loading: true
            }
        case SET_USER_ID:
            return {
                ...state,
                id: payload
            }
        case `${UPDATE_SETTINGS}_PENDING`:
            return {
                ...state,
                loading: true
            }
        case `${UPDATE_SETTINGS}_FULFILLED`:
            console.log('updated settings', payload)
            return {
                ...state,
                primaryColor: payload.data.primary_color,
                profileImgUrl: payload.data.profile_img_url,
                loading: false
            }
        case `${REGISTER_USER}_PENDING`:
            return {
                ...state,
                loading: true
            }
        case `${REGISTER_USER}_FULFILLED`:
            return {
                ...state,
                id: payload.data.id,
                loading: false
            }
        case `${LOGIN}_FULFILLED`:
            return state
        case `${LOGOUT}_PENDING`:
            return {
                ...state,
                loading: true
            }
        case `${LOGOUT}_FULFILLED`:
            return {
                ...state,
                loading: false
            }
        case `${DELETE_USER}_PENDING`:
            return {
                ...state,
                loading: true
            }
        case `${DELETE_USER}_FULFILLED`:
            return {
                file: null,
                id: null,
                username: '',
                primaryColor: '',
                profileImgUrl: '',
                loading: false
            }
        // case SET_IO:
        //     return {
        //         ...state,
        //         io: payload
        //     }
        // case JOIN_ROOM:
        //     return {
        //         ...state,
        //         rooms: [...state.rooms, payload]
        //     }
        default: return state
    }
}