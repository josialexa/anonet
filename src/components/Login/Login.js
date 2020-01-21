import React, { Component } from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import {setUserId} from '../../redux/reducers/userReducer'

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
                console.log(res.data.id)
                this.props.setUserId(res.data.id)
                this.props.history.push('/')
            })
            .catch(err => {
                console.log('Login error:', err)
            })

            this.setState({
                username: '',
                password: ''
            })
    }

    keypress = e => {
        if(e.charCode == 13) this.submit()
    }

    render() {
        return (
            <div>
                <input placeholder='Username' onChange={e => this.handleChange(e, 'username')} value={this.state.username} />
                <input type='password' placeholder='Password' onKeyPress={this.keypress} onChange={e => this.handleChange(e, 'password')} value={this.state.password} />
                <button onClick={this.submit}>Submit</button>
                <span>Don't have an account?  <Link to='/register'>Register</Link></span>
            </div>
        )
    }
}

export default connect(undefined, {setUserId})(withRouter(Login))
// export default connect(undefined, {updateUserData})(Login)