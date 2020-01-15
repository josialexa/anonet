import React, { Component } from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import io from 'socket.io-client'

class Home extends Component {
    constructor() {
        super()

        this.state = {
            username: '',
            profileImgUrl: '',
            primaryColor: '',
            rooms: [],
            socket: io('http://localhost:4000')
        }
    }

    componentDidMount() {
        console.log(this.props.username)
        if(!this.props.username) {
            this.props.history.push('/login')
        }
    }

    render() {
        return (
            <div>
                Home
                <h1>{this.props.username}</h1>
            </div>
        )
    }
}

const checkout = state => ({
    username: state.ur.username,
    profileImgUrl: state.ur.profileImgUrl,
    primaryColor: state.ur.primaryColor,
    rooms: state.ur.rooms
})

export default connect(checkout)(withRouter(Home))