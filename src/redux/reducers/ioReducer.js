import io from 'socket.io-client'
require('dotenv').config()
// const io = socketIo('http://172.31.99.73:4000')

const initialState = {
    io: io(),
    user: {},
    joinedRooms: [],
    roomUsers: [],
    currentRoom: {id: 0, name: 'nothing'},
    messages: {},
    isMod: false
}

const IO_CONNECT = 'IO_CONNECT'
const IO_DISCONNECT = 'IO_DISCONNECT'
const SET_USER = 'SET_USER'
const JOIN_ROOM = 'JOIN_ROOM'
const JOIN_ROOM_RESPONSE = 'JOIN_ROOM_RESPONSE'
const LEAVE_ROOM = 'LEAVE_ROOM'
const SET_CURRENT_ROOM = 'SET_CURRENT_ROOM'
const GET_ROOM_USERS = 'GET_ROOM_USERS'
const SET_ROOM_USERS = 'SET_ROOM_USERS'
const SEND_MESSAGE = 'SEND_MESSAGE'
const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE'
const ADD_MOD_REQUEST = 'ADD_MOD_REQUEST'
const ADD_MOD_RESPONSE = 'ADD_MOD_RESPONSE'
const REMOVE_MOD_REQUEST = 'REMOVE_MOD_REQUEST'
const REMOVE_MOD_RESPONSE = 'REMOVE_MOD_RESPONSE'
const ADD_BAN_REQUEST = 'ADD_BAN_REQUEST'
const ADD_BAN_RESPONSE = 'ADD_BAN_RESPONSE'
const REMOVE_BAN_REQUEST = 'REMOVE_BAN_REQUEST'
const REMOVE_BAN_RESPONSE = 'REMOVE_BAN_RESPONSE'

export const ioConnect = host => {
    return {
        type: IO_CONNECT,
        payload: {
            io: io,
            host
        }
    }
}

export const ioDisconnect = () => {
    return {
        type: IO_DISCONNECT
    }
}

export const setUser = user => {
    return {
        type: SET_USER,
        payload: user
    }
}

export const joinRoom = (room, user) => {
    // console.log('room and user', room, user)
    return {
        type: JOIN_ROOM,
        payload: {
            localTime: new Date().getTime(),
            room,
            user
        }
    }
}

export const joinRoomResponse = res => {
    return {
        type: JOIN_ROOM_RESPONSE,
        payload: res
    }
}

export const leaveRoom = (room, user) => {
    return {
        type: LEAVE_ROOM,
        payload: {
            room,
            user
        }
    }
}

export const setCurrentRoom = room => {
    return {
        type: SET_CURRENT_ROOM,
        payload: room
    }
}

export const getRoomUsers = room => {
    return {
        type: GET_ROOM_USERS,
        payload: room
    }
}

export const setRoomUsers = users => {
    return {
        type: SET_ROOM_USERS,
        payload: users
    }
}

export const sendMessage = msg => {
    // console.log('send:', msg)
    return {
        type: SEND_MESSAGE,
        payload: msg
    }
}

export const receiveMessage = msg => {
    // console.log(msg)
    return {
        type: RECEIVE_MESSAGE,
        payload: msg
    }
}

export const addModRequest = (user, room) => {
    return {
        type: ADD_MOD_REQUEST,
        payload: {
            user, room
        }
    }
}

export const addModResponse = room => {
    return {
        type: ADD_MOD_RESPONSE,
        payload: room
    }
}

export const removeModRequest = (user, room) => {
    return {
        type: REMOVE_MOD_REQUEST,
        payload: {
            user, room
        }
    }
}

export const removeModResponse = (user, room) => {
    return {
        type: REMOVE_MOD_RESPONSE,
        payload: {user, room}
    }
}

export const addBanRequest = (user, room, ban) => {
    return {
        type: ADD_BAN_REQUEST,
        payload: {
            user, room, ban
        }
    }
}

export const addBanResponse = (user, room, ban) => {
    return {
        type: ADD_BAN_RESPONSE,
        payload: {user, room, ban}
    }
}

export const removeBanRequest = (user, room, ban) => {
    return {
        type: REMOVE_BAN_REQUEST,
        payload: {
            user, room, ban
        }
    }
}

export const removeBanResponse = (user, room, ban) => {
    return {
        type: REMOVE_BAN_RESPONSE,
        payload: {user, room, ban}
    }
}

export default function reducer(state = initialState, action) {
    const {type, payload} = action

    switch(type) {
        case IO_CONNECT:
            return {
                ...state,
                io: payload.io(payload.host)
            }
        case IO_DISCONNECT:
            state.io.emit('disconnect')
            return {
                ...state,
                io: null,
                currentRoom: '',
                roomUsers: [],
                joinedRooms: [],
                messages: {}
            }
        case SET_USER:
            return {
                ...state,
                user: payload
            }
        case JOIN_ROOM:
            state.io.emit('join-room', payload.localTime, payload.room, payload.user)
            console.log('joining room', payload)
            // return {
            //     ...state,
            //     joinedRooms: [...state.joinedRooms, payload.room],
            //     messages: {...state.messages, [payload.room.name]: [{from: payload.room.name, message: `${payload.user.username} has entered the room!`, localTime: payload.localTime}]}
            // }
            return state
        case JOIN_ROOM_RESPONSE:
            console.log(payload)
            const welcomeMessages = !state.messages[payload.room.name] ?
                [{from: {id: 0, username: payload.room.name, primaryColor: '#000000', profileImgUrl: 'https://anonet.s3.us-east-2.amazonaws.com/defaultUser.png'}, message: payload.message, localTime: payload.localTime}]
            :
                [...state.messages[payload.room.name], {from: {id: 0, username: payload.room.name, primaryColor: '#000000', profileImgUrl: 'https://anonet.s3.us-east-2.amazonaws.com/defaultUser.png'}, message: payload.message, localTime: payload.localTime}]
                // console.log('join-room-response', {
                //     ...state,
                //     messages: {...state.messages, [payload.room.name]: welcomeMessages}
                // })
                // console.log(state.messages[payload.room.name].findIndex(v => v.message == payload.message && v.localTime == payload.localTime))
                // console.log(state.messages[payload.room.name], payload.localTime)
            if(state.messages[payload.room.name] && state.messages[payload.room.name].findIndex(v => v.message == payload.message && v.localTime == payload.localTime) != -1) {
                return state
            } else {
                console.log('room finder', state.joinedRooms.findIndex(v => v.name == payload.room.name))
                if(state.joinedRooms.findIndex(v => v.name == payload.room.name) == -1) {
                    return {
                        ...state,
                        messages: {...state.messages, [payload.room.name]: welcomeMessages},
                        joinedRooms: [...state.joinedRooms, payload.room],
                        user: payload.user
                    }
                }
                    return {
                    ...state,
                    messages: {...state.messages, [payload.room.name]: welcomeMessages}
                }
            }
            
        case LEAVE_ROOM:
            state.io.emit('leave-room', payload.room)
            console.log('leave-room', payload)
            return {
                ...state,
                joinedRooms: state.joinedRooms.filter(v => v.id != payload.room.id),
                currentRoom: {id: 0, name: 'nothing'}
            }
        case SET_CURRENT_ROOM:
            state.io.emit('get-room-users', payload)
            return {
                ...state,
                currentRoom: payload
            }
        case GET_ROOM_USERS:
            state.io.emit('get-room-users', payload)
            return state
        case SET_ROOM_USERS:
            console.log('set-users', payload)
            return {
                ...state,
                roomUsers: payload
            }
        case SEND_MESSAGE:
            state.io.emit('send-message', payload)
            return {
                ...state,
                messages: {...state.messages, [payload.room.name]: [...state.messages[payload.room.name], {from: payload.user, message: payload.message}]}
            }
        case RECEIVE_MESSAGE:
            console.log('receive message:', payload)
            const roomMessages = !state.messages[payload.room.name] ?
                [{from: payload.user, message: payload.message, localTime: payload.localTime}]
            :
                [...state.messages[payload.room.name], {from: payload.user, message: payload.message, localTime: payload.localTime}]
            if(state.messages[payload.room.name].indexOf({from: payload.user, message: payload.message}) != -1) return state
            if(state.messages[payload.room.name].findIndex(v => v.from == payload.user && v.localTime == payload.localTime) != -1) return state
            return {
                ...state,
                messages: {...state.messages, [payload.room.name]: roomMessages}
            }
        case ADD_MOD_REQUEST:
            state.io.emit('add-mod-request', payload.user, payload.room)
            return state
        case ADD_MOD_RESPONSE:
            let modAdd = state.joinedRooms
            const indexAddMod = modAdd.findIndex(v => v.id == payload.room.id)
            if(indexAddMod != -1) modAdd[indexAddMod] = payload.room
            return {
                ...state,
                joinedRooms: modAdd
            }
        case REMOVE_MOD_REQUEST:
            state.io.emit('remove-mod-request', payload.user, payload.room)
            return state
        case REMOVE_MOD_RESPONSE:
            let modRemove = state.joinedRooms
            const indexRemoveMod = modRemove.findIndex(v => v.id == payload.room.id)
            if(indexRemoveMod != -1) modRemove[indexRemoveMod] = payload.room
            return {
                ...state,
                joinedRooms: modRemove
            }
        case ADD_BAN_REQUEST:
            state.io.emit('add-ban-request', payload.user, payload.room, payload.ban)
            return state
        case ADD_BAN_RESPONSE:
            let addBan = state.joinedRooms
            let removeMessages = state.messages
            const indexAddBan = addBan.findIndex(v => v.id = payload.room.id)
            if(indexAddBan != -1) {
                addBan.splice(indexAddBan)
                delete removeMessages[payload.room.name]
                if(state.currentRoom.name == payload.room.name) {
                    return {
                        ...state,
                        joinedRooms: addBan,
                        messages: removeMessages,
                        currentRoom: {},
                        roomUsers: []
                    }
                } else {
                    return {
                        ...state,
                        joinedRooms: addBan,
                        messages: removeMessages
                    }
                }
            } else {
                return state
            }
        case REMOVE_BAN_REQUEST:
            state.io.emit('remove-ban-request', payload.user, payload.room, payload.ban)
            return state
        case REMOVE_BAN_RESPONSE:
            return state
        default: return state
    }
}