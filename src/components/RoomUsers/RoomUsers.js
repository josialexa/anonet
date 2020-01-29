import React, { Component } from 'react'
import {connect} from 'react-redux'
import {getRoomUsers, setRoomUsers, addModRequest, addModResponse, removeModRequest, removeModResponse, addBanRequest, removeBanResponse, addBanResponse} from '../../redux/reducers/ioReducer'
import {setCurrentUser} from '../../redux/reducers/banReducer'
import './RoomUsers.css'

class RoomUsers extends Component {
    constructor() {
        super()

        this.state = {
            hide: true
        }
    }

    componentDidMount() {
        this.props.getRoomUsers(this.props.currentRoom.name)

        this.props.io.on('set-room-users', users => {
            console.log('room-users', users)
            this.props.setRoomUsers(users)
        })

        this.props.io.on('add-mod-response', (user, room) => {
            this.props.addModResponse(user, room)
        })

        this.props.io.on('remove-mod-response', (user, room) => {
            this.props.removeModResponse(user, room)
        })

        this.props.io.on('add-ban-response', (user, room, ban) => {
            this.props.addBanResponse(user, room, ban)
        })

        this.props.io.on('remove-ban-response', (user, room, ban) => {
            this.props.removeBanResponse(user, room, ban)
        })
    }

    showPopUp = (e, user) => {
        console.log('hit')
        this.props.setCurrentUser(user)

        const popUp = document.getElementById('pop-up')
        console.log(popUp, e.pageX, e.pageY)
        popUp.style.top = (e.pageY + 10) + 'px'
        popUp.style.left = (e.pageX + 5) + 'px'
        popUp.style.display = 'flex'

        this.setState({hide: false})
    }

    hidePopUp = () => {
        this.props.setCurrentUser({})
        this.setState({hide: true})
        const popUp = document.getElementById('pop-up')
        popUp.style.display = 'none'
    }

    render() {
        console.log('ban disabled', this.props.currentRoom.owner, this.props.id, this.props.currentRoom.isMod, !(this.props.currentRoom.owner == this.props.id) && !this.props.currentRoom.isMod)
        return (
            <div className='room-user-list'>
                <h2>Users in Room:</h2>
                {this.props.roomUsers ? 
                    this.props.roomUsers.map(v => (
                        <span key={v.id} onClick={e => this.showPopUp(e, v)}>{v.username}</span>
                    ))
                :
                    null
                }
                <div id='pop-up'>
                    <div className='pop-up-close' onClick={this.hidePopUp}>X</div>
                    <button onClick={this.props.currentRoom.isMod ? () => this.props.removeModRequest(this.props.user, this.props.currentRoom) : () => this.props.addModRequest(this.props.user, this.props.currentRoom)} disabled={!(this.props.currentRoom.owner == this.props.id)}>{this.props.currentRoom.isMod ? 'Remove moderator' : 'Make moderator'}</button>
                    <button disabled={!(this.props.currentRoom.owner == this.props.id) && !this.props.currentRoom.isMod}>Ban this user</button>
                </div>
            </div>
        )
    }
}

const checkout = state => ({
    io: state.ir.io,
    id: state.ur.id,
    user: state.ir.user,
    roomUsers: state.ir.roomUsers,
    currentRoom: state.ir.currentRoom
})

export default connect(checkout, {getRoomUsers, setRoomUsers, setCurrentUser, addModRequest, addModResponse, removeModRequest, removeModResponse, addBanRequest, addBanResponse, removeModResponse})(RoomUsers)