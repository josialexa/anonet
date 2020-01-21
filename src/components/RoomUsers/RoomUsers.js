import React, { Component } from 'react'
import {connect} from 'react-redux'
import {getRoomUsers, setRoomUsers} from '../../redux/reducers/ioReducer'
import './RoomUsers.css'

class RoomUsers extends Component {
    componentDidMount() {
        this.props.getRoomUsers(this.props.currentRoom)

        this.props.io.on('set-room-users', users => {
            this.props.setRoomUsers(users)
        })
    }

    render() {
        return (
            <div className='room-user-list'>
                <h2>Users in Room:</h2>
                {this.props.roomUsers ? 
                    this.props.roomUsers.map(v => (
                        <span>{v}</span>
                    ))
                :
                    null
                }           
            </div>
        )
    }
}

const checkout = state => ({
    io: state.ir.io,
    roomUsers: state.ir.roomUsers,
    currentRoom: state.ir.currentRoom
})

export default connect(checkout, {getRoomUsers, setRoomUsers})(RoomUsers)