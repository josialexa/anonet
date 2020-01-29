import axios from 'axios'

const initialState = {
    loading: false
}

const CREATE_MOD = 'CREATE_MOD'
const DELETE_MOD = 'DELETE_MOD'

export const createMod = (user, room) => {
    return {
        type: CREATE_MOD,
        payload: axios.post('/api/moderators')
    }
}

export const deleteMod = id => {
    return {
        type: DELETE_MOD,
        payload: axios.delete(`/api/moderators/${id}`)
    }
}

export default function reducer(state = initialState, action) {
    const {type, payload} = action

    switch(type) {
        case `${CREATE_MOD}_PENDING`:
            return {
                ...state,
                loading: true
            }
        case `${CREATE_MOD}_FULFILLED`:
            return {
                ...state,
                loading: false
            }
        case `${DELETE_MOD}_PENDING`:
            return {
                ...state,
                loading: true
            }
        case `${DELETE_MOD}_FULFILLED`:
            return {
                ...state,
                loading: false
            }
        default: return state
    }
}