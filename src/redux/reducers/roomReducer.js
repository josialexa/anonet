import axios from 'axios'

const initialState = {
    rooms: []
}

const CREATE_ROOM = 'CREATE_ROOM'
const GET_ALL_ROOMS = 'GET_ALL_ROOMS'

export const createRoom = room => {
    return {
        type: CREATE_ROOM,
        payload: axios.post('/api/rooms', room)
    }
}

export const getAllRooms = () => {
    return {
        type: GET_ALL_ROOMS,
        payload: axios.get('/api/rooms')
    }
}

export default function reducer(state = initialState, action) {
    const {type, payload} = action

    switch(type) {
        case `${CREATE_ROOM}_FULFILLED`:
            return {
                ...state,
                rooms: payload.data
            }
        case `${GET_ALL_ROOMS}_FULFILLED`:
            return {
                ...state,
                rooms: payload.data
            }
        default: return state
    }
}