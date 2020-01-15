import axios from 'axios'

const initialState = {
    message: '',
    file: null,
    id: null,
    username: '',
    primaryColor: '',
    profileImgUrl: '',
    rooms: []
}

const UPDATE_USER_DATA = 'UPDATE_USER_DATA'
const UPDATE_MESSAGE = 'UPDATE_MESSAGE'
const UPDATE_FILE = 'UPDATE_FILE'
const JOIN_ROOM = 'JOIN_ROOM'
const LEAVE_ROOM = 'LEAVE_ROOM'

export const updateUserData = (data) => {
    return {
        type: UPDATE_USER_DATA,
        payload: data
    }
}

export const joinRoom = (room) => {
    return {
        type: JOIN_ROOM,
        payload: room
    }
}

export default function reducer(state = initialState, action) {
    const {type, payload} = action

    switch(type) {
        case UPDATE_USER_DATA:
            console.log(payload)
            return {
                ...state,
                id: payload.id,
                username: payload.username,
                primaryColor: payload.primaryColor,
                profileImgUrl: payload.profileImgUrl
            }
        case JOIN_ROOM:
            return {
                ...state,
                rooms: [...state.rooms, payload]
            }
        default: return state
    }
}