import React, { Component } from 'react'
import {connect} from 'react-redux'
import {sendMessage, receiveMessage, joinRoomResponse, leaveRoom} from '../../redux/reducers/ioReducer'
import './ChatDisplay.css'

class ChatDisplay extends Component {
    constructor(props) {
        super(props)

        this.state = {
            message: ''
        }
    }

    componentDidMount() {
        this.props.io.on('send-message-response', msg => {
            console.log('message received!')
            this.props.receiveMessage(msg)
        })

        this.props.io.on('join-room-response', msg => {
            console.log('room message received!', msg)
            this.props.joinRoomResponse(msg)
        })
    }


    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onKeyPress = e => {
        if(e.charCode == 13) this.submit()
    }

    submit = () => {
        const msg = {
            room: this.props.currentRoom,
            user: this.props.username,
            message: this.state.message
        }
        this.props.sendMessage(msg)
        this.setState({
            message: ''
        })
        console.log(this.props.messages)
    }

    leave = () => {
        this.props.leaveRoom(this.props.currentRoom)
    }

    render() {
        return (
            <div className='chat-display'>
                <div>{this.props.currentRoom ? <button onClick={this.leave}>Leave Room</button> : null}</div>
                <div className='message-display'>
                    {this.props.messages && this.props.currentRoom && this.props.messages[this.props.currentRoom.name] ?
                        this.props.messages[this.props.currentRoom.name].map((v, i) => (
                            <div key={i} className='room-message'>{`${v.from}: ${v.message}`}</div>
                        ))
                    :
                        null
                    }
                </div>
                <div className='chat-input'>
                    <input className='message-input' name='message' onChange={this.handleChange} onKeyPress={this.onKeyPress} value={this.state.message}/>
                    <button className='input-submit' onClick={this.submit}>Send</button>
                </div>
            </div>
        )
    }
}

const checkout = state => ({
    username: state.ur.username,
    messages: state.ir.messages,
    currentRoom: state.ir.currentRoom,
    io: state.ir.io
})

export default connect(checkout, {sendMessage, receiveMessage, joinRoomResponse, leaveRoom})(ChatDisplay)