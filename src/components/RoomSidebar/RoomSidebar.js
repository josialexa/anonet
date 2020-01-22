import React, { Component } from 'react'
import {connect} from 'react-redux'
import {getAllRooms, createRoom} from '../../redux/reducers/roomReducer'
import {joinRoom, setCurrentRoom} from '../../redux/reducers/ioReducer'
import './RoomSidebar.css'

class RoomSidebar extends Component {
    constructor() {
        super()

        this.state = {
            roomName: '',
            roomTopic: ''
        }
    }

    componentDidMount() {
        this.props.getAllRooms()
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    join = room => {
        if(this.props.joinedRooms.indexOf(room) == -1) this.props.joinRoom(room, {id: this.props.id, username: this.props.username})
    }

    submit = () => {
        const {roomName, roomTopic} = this.state
        console.log(roomName, roomTopic)
        this.props.createRoom({roomName, roomTopic})
        this.props.getAllRooms()
        this.setState({
            roomName: '',
            roomTopic: ''
        })
    }

    render() {
        return (
            <div className='room-sidebar'>
                <div className='room-sidebar-all-rooms'>
                    <h2>All Rooms:</h2>
                    {this.props.allRooms ?
                        this.props.allRooms.map(v => (
                            <span key={`all-${v.id}`} className='room-sidebar-room' onClick={() => this.join(v)}>{v.name}</span>
                        ))
                    :
                        null
                    }
                </div>
                <hr />
                <div className='room-sidebar-joined-rooms'>
                    <h2>Joined Rooms:</h2>
                    {this.props.joinedRooms ?
                        this.props.joinedRooms.map(v => (
                            <span key={`joined-${v.id}`} className='room-sidebar-room' onClick={() => this.props.setCurrentRoom(v)}>{v.name}</span>
                        ))
                    :
                        null
                    }
                </div>
                <div className='room-sidebar-create'>
                    <input name='roomName' onChange={this.handleChange} placeholder='Room Name' value={this.state.roomName} />
                    <textarea name='roomTopic' rows='5' onChange={this.handleChange} placeholder='Room Topic' value={this.state.roomTopic} />
                    <button onClick={this.submit}>Create New Room</button>
                </div>
            </div>
        )
    }
}

const checkout = state => ({
    allRooms: state.rr.rooms,
    joinedRooms: state.ir.joinedRooms,
    id: state.ur.id,
    username: state.ur.username
})

export default connect(checkout, {getAllRooms, createRoom, joinRoom, setCurrentRoom})(RoomSidebar)