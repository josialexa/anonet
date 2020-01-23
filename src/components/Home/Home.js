import React, { Component } from 'react'
import {connect} from  'react-redux'
import {withRouter, Link} from 'react-router-dom'
import Loading from '../Loading/Loading'
import RoomUsers from '../RoomUsers/RoomUsers'
import RoomSidebar from '../RoomSidebar/RoomSidebar'
import ChatDisplay from '../ChatDisplay/ChatDisplay'
import {updateUserData, logout} from '../../redux/reducers/userReducer'
import {ioDisconnect} from '../../redux/reducers/ioReducer'
import './Home.css'

class Home extends Component {
    constructor() {
        super()

        this.state = {
            hideStatus: 'hidden'
        }
    }

    componentDidMount() {
        if(!this.props.id) {
            this.props.history.push('/login')
        } else {
            this.props.updateUserData(this.props.id)
            // this.props.getAllRooms()
            // this.props.ioConnect('http://172.31.99.73:4000')
            console.log('primary color', this.props.primaryColor)
            
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.primaryColor != this.props.primaryColor) {
            document.documentElement.style.setProperty('--primary-color', this.props.primaryColor)
        }
    }

    signout = () => {
        this.props.logout()
        this.props.ioDisconnect()
        this.props.history.push('/login')
    }

    toggleMenu = () => {
        if(this.state.hideStatus == 'hidden') {
            this.setState({
                hideStatus: 'shown'
            })
        } else {
            this.setState({
                hideStatus: 'hidden'
            })
        }
    }

    render() {
        return (
            <div className='home'>
                {this.props.loading ? <Loading /> : null}
                <header>
                    <span>Hello, {this.props.username}</span>
                    <img src={this.props.profileImgUrl} className='home-profile-image' alt='Avatar' onClick={this.toggleMenu} />
                    <div className={`menu-${this.state.hideStatus}`}>
                        <Link to='/settings/edit'><button>Edit Settings</button></Link>
                        <button onClick={this.signout}>Log Out</button>
                    </div>
                </header>
                <section>
                    <RoomSidebar />
                    <ChatDisplay />
                    <RoomUsers />
                </section>
            </div>
        )
    }
}

const checkout = state => ({
    id: state.ur.id,
    username: state.ur.username,
    profileImgUrl: state.ur.profileImgUrl,
    primaryColor: state.ur.primaryColor,
    loading: state.ur.loading,
    allRooms: state.rr.rooms,
    io: state.ir.io
})

export default connect(checkout, {updateUserData, ioDisconnect, logout})(withRouter(Home))