import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {setUserId, registerUser} from '../../redux/reducers/userReducer'

class Register extends Component {
    constructor() {
        super()

        this.state = {
            username: '',
            password: '',
            over18: false
        }
    }

    componentDidUpdate(prevProps) {
        if(!this.props.loading && this.props.id) {
            this.props.history.push('/')
        }
    }

    handleChange = (e, target) => {
        const updater = {}
        updater[target] = e.target.value

        this.setState(updater)
    }

    submit = () => {
        const {username, password} = this.state
        // axios.post('/auth/register', {username, password})
        //     .then(res => {
        //         console.log(res.data.id)
        //         this.props.setUserId(res.data.id)

        //         console.log('registered:', res.data)
        //     })
        //     .catch(err => {
        //         console.log('Error in registration:', err)
        //     })

        this.props.registerUser(username, password)

        this.setState({
            username: '',
            password: ''
        })
    }

    checkClick = e => {
        this.setState({over18: e.target.checked})
    }

    render() {
        return (
            <div>
                <input placeholder='Username' onChange={e => this.handleChange(e, 'username')} value={this.state.username} />
                <input type='password' placeholder='Password' onChange={e => this.handleChange(e, 'password')} value={this.state.password} />
                <input type='checkbox' checked={this.state.over18} onClick={this.checkClick} /><span> I am 18 years of age or older</span>
                <button onClick={this.submit} disabled={!this.state.over18}>Submit</button>
            </div>
        )
    }
}

const checkout = state => ({
    id: state.ur.id,
    loading: state.ur.loading
})

export default connect(checkout, {setUserId, registerUser})(Register)