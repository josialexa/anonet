import React, { Component } from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {withRouter, Redirect} from 'react-router-dom'
import {updateUserData} from '../../redux/userReducer'

class Login extends Component {
    constructor() {
        super()

        this.state = {
            username: '',
            password: ''
        }
    }

    handleChange = (e, target) => {
        const updater = {}
        updater[target] = e.target.value

        this.setState(updater)
    }

    submit = () => {
        const {username, password} = this.state
        axios.post('/auth/login', {username, password})
            .then(res => {
                this.props.updateUserData(res.data)
                this.props.history.push('/')
                // return (<Redirect to='/' />)
            })
            .catch(err => {
                console.log('Login error:', err)
            })

            this.setState({
                username: '',
                password: ''
            })
    }

    render() {
        return (
            <div>
                <input placeholder='Username' onChange={e => this.handleChange(e, 'username')} value={this.state.username} />
                <input type='password' placeholder='Password' onChange={e => this.handleChange(e, 'password')} value={this.state.password} />
                <button onClick={this.submit}>Submit</button>
            </div>
        )
    }
}

export default connect(undefined, {updateUserData})(withRouter(Login))
// export default connect(undefined, {updateUserData})(Login)