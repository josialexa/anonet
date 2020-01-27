import React, { Component } from 'react'
import {connect} from 'react-redux'
import {sendMessage, receiveMessage, joinRoomResponse, leaveRoom} from '../../redux/reducers/ioReducer'
import './ChatDisplay.css'

const detLum = color => {
    const colors = []
    colors.push(color.substr(1, 2))
    colors.push(color.substr(3, 2))
    colors.push(color.substr(5, 2))

    console.log(colors)

    const lum = Math.floor(colors.reduce((t, v) => t += Math.floor((parseInt(v, 16) / 255) * 100), 0) / 3)
    return lum
}

class ChatDisplay extends Component {
    constructor(props) {
        super(props)

        this.state = {
            message: ''
        }
    }

    componentDidMount() {
        this.props.io.on('send-message-response', msg => {
            console.log('message received!', msg)
            this.props.receiveMessage(msg)
        })

        this.props.io.on('join-room-response', msg => {
            console.log('room message received!', msg)
            this.props.joinRoomResponse(msg)
        })
    }

    componentDidUpdate(prevProps) {
        if(this.props.primaryColor != prevProps.primaryColor && this.props.primaryColor && !this.props.loading) {
            document.documentElement.style.setProperty('--primary-color', this.props.primaryColor)
            // console.log('lum', detLum(this.props.primaryColor))
            
        }
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
        const user = {
            id: this.props.id,
            username: this.props.username,
            primaryColor: this.props.primaryColor,
            profileImgUrl: this.props.profileImgUrl
        }
        const msg = {
            localTime: new Date().getTime(),
            room: this.props.currentRoom,
            user,
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
                <div>{this.props.currentRoom.id ? <button onClick={this.leave}>Leave Room</button> : null}</div>
                <div className='message-display'>
                    {this.props.messages && this.props.currentRoom && this.props.messages[this.props.currentRoom.name] ?
                        this.props.messages[this.props.currentRoom.name].map((v, i) => (
                            <div key={`${v.from.id}-${i}`} className='room-message'><img style={{backgroundColor: v.from.primaryColor}} src={v.from.profileImgUrl} className='message-profile-img' /><span style={{color: v.from.primaryColor}}>{v.from.username}</span>: {v.message}</div>
                        ))
                    :
                        null
                    }
                </div>
                {this.props.currentRoom.id ? (
                    <div className='chat-input'>
                        <input className='message-input' name='message' onChange={this.handleChange} onKeyPress={this.onKeyPress} value={this.state.message}/>
                        <button className='input-submit' onClick={this.submit}>Send</button>
                    </div>
                    )
                :
                    null
                }
            </div>
        )
    }
}

const checkout = state => ({
    username: state.ur.username,
    id: state.ur.id,
    primaryColor: state.ur.primaryColor,
    profileImgUrl: state.ur.profileImgUrl,
    loading: state.ur.loading,
    messages: state.ir.messages,
    currentRoom: state.ir.currentRoom,
    io: state.ir.io
})

export default connect(checkout, {sendMessage, receiveMessage, joinRoomResponse, leaveRoom})(ChatDisplay)