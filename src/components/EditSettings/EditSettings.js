import React, { Component } from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import {SketchPicker} from 'react-color'
import reactCSS from 'reactcss'
import Loading from '../Loading/Loading'
import {updateUserData, updateSettings, deleteUser} from '../../redux/reducers/userReducer'
import './EditSettings.css'

class EditSettings extends Component {
    constructor(props) {
        super(props)

        this.state = {
            uploadedUrl: this.props.profileImgUrl,
            colorSelection: this.props.primaryColor,
            displayPicker: false
        }
    }

    componentDidMount() {
        if(!this.props.id) {
            this.props.history.push('/login')
        }
        document.documentElement.style.setProperty('--primary-color', this.props.primaryColor)
        
    }

    componentDidUpdate(prevProps) {
        if(!this.props.id) {
            this.props.history.push('/login')
        } else {
            if(this.props.primaryColor != prevProps.primaryColor && !this.props.loading) {
                document.documentElement.style.setProperty('--primary-color', this.props.primaryColor)
            }
        }
    }

    fileOnChange = e => {
        const files = e.target.files
        const file = files[0]
        if(file == null) {
            alert('Error selecting file!')
        } else {
            axios.get(`/api/media/sign-s3?fileName=${file.name}&file-type=${file.type}`)
                .then(resSigned => {
                    console.log(file)
                    axios.put(resSigned.data.signedRequest, file, {
                        headers: {
                            'Content-Type': file.type
                            // 'Content-Length': file.size
                        }
                    })
                        .then(resUpload => {
                            this.setState({
                                uploadedUrl: resSigned.data.url
                            })
                        })
                        .catch(err => {
                            console.log('Error uploading file:', err)
                        })
                })
                .catch(err => {
                    console.log('Error prepping file upload:', err)
                })
        }
    }


    handleColorClick = () => {
        this.setState({ displayPicker: !this.state.displayColorPicker })
    }

    handleColorClose = () => {
        this.setState({ displayPicker: false })
    }

    handleColorChange = color => {
        this.setState({
            colorSelection: color.hex
        })
    }

    submit = () => {
        const settings = {
            username: this.props.username,
            profileImgUrl: this.state.uploadedUrl,
            primaryColor: this.state.colorSelection
        }

        console.log(settings)
        this.props.updateSettings(settings)
        this.props.updateUserData(this.props.id)
        document.documentElement.style.setProperty('--primary-color', this.state.colorSelection)
        this.props.history.push('/')
    }

    cancel = () => {
        this.setState({
            colorSelection: this.props.primaryColor,
            uploadedUrl: this.props.profileImgUrl
        })
        this.props.history.push('/')
    }

    delete = () => {
        const conf = window.confirm("Are you sure you want to delete your account?")

        if(conf) {
            console.log('delete account')
            this.props.deleteUser(this.props.id)
        } else {
            console.log('don\'t delete account')
        }
    }

    render() {
        const styles = reactCSS({
            'default': {
                color: {
                    color: this.state.colorSelection
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                }
            }
        })

        return (
            <div className='edit-settings'>
                {this.props.loading ? <Loading /> : null}
                <div className='edit-settings-name-image'>
                    <h1>{this.props.username}</h1>
                    <img className='edit-settings-image' src={this.state.uploadedUrl} alt='Avatar' />
                    <label htmlFor='image_upload' className='file-upload'>Upload a new Profile Image</label>
                    <input type='file' onChange={this.fileOnChange} accept='image/*' name='image_upload' id='image_upload' />
                    <input type='hidden' value={this.state.uploadedUrl} />
                </div>
                <div className='edit-settings-color'>
                    <h3>Primary Color</h3>
                    {this.state.displayPicker ? (
                        <div style={ styles.popover }>
                            <div style={ styles.cover } onClick={ this.handleColorClose }/>
                            <SketchPicker color={ this.state.colorSelection } onChange={ this.handleColorChange } />
                        </div>
                    ) : null}
                    <span style={styles.color} onClick={this.handleColorClick}>{this.state.colorSelection}</span>
                    <button className='save-changes-button' onClick={this.submit} >Save Changes</button>
                    <div>
                        <button className='cancel-changes-button' onClick={this.cancel}>Cancel</button>
                    </div>
                    <div>
                        <button className='delete-account-button' onClick={this.delete}>Delete Account</button>
                    </div>
                </div>
            </div>
        )
    }
}

const checkout = state => ({
    id: state.ur.id,
    username: state.ur.username,
    primaryColor: state.ur.primaryColor,
    profileImgUrl: state.ur.profileImgUrl,
    loading: state.ur.loading
})

export default connect(checkout, {updateUserData, updateSettings, deleteUser})(withRouter(EditSettings))