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
const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'
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

export const login = () => {

}

export const logout = () => {
    return {
        type: LOGOUT,
        payload: axios.get('/auth/logout')
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
            return {
                ...state,
                primaryColor: payload.data.primary_color,
                profileImgUrl: payload.data.profile_img_url,
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