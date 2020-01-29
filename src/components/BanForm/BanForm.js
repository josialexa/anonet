import React, { Component } from 'react'
import {connect} from 'react-redux'
import {createBan} from '../../redux/reducers/banReducer'

class BanForm extends Component {
    constructor() {
        super()

        this.state = {
            banEnd: ''
        }
    }

    // componentDidUpdate() {
    //     if(this.props.loading)
    // }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    submit = () => {
        this.props.createBan({
            ...this.props.currentUser,
            banEnd
        })
    }

    render() {
        return (
            <div className='ban-form'>
                <h2>{this.props.currentUser.username}</h2>
                <span>Please enter the date and time the ban will end</span>
                <span>(Format: YYYY-DD-MM HH:MM)</span>
                <div className='ban-form-inputs'>
                    <input name='date-time' onChange={this.handleChange} value={this.state.banEnd} placeholder='YYYY-DD-MM HH:MM' />
                    <button onClick={this.submit}>Submit</button>
                </div>
            </div>
        )
    }
}

const checkout = state => {
    currentUser: state.br.currentUser
    loading: state.br.loading
}

export default connect(checkout, {createBan})(BanForm)