import React, { Component } from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import {SketchPicker} from 'react-color'
import reactCSS from 'reactcss'
import {updateSettings} from '../../redux/reducers/userReducer'
import './EditSettings.css'

class EditSettings extends Component {
    constructor(props) {
        super(props)

        this.state = {
            uploadedUrl: this.props.profileImgUrl,
            primaryColor: this.props.primaryColor,
            displayPicker: false
        }
    }

    componentDidMount() {
        if(!this.props.id) {
            this.props.history.push('/login')
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
            primaryColor: color.hex
        })
    }

    submit = () => {
        const settings = {
            profileImgUrl: this.state.uploadedUrl,
            primaryColor: this.state.primaryColor
        }

        this.props.updateSettings(settings)
        document.documentElement.style.setProperty('--primary-color', this.state.primaryColor)
    }

    render() {
        const styles = reactCSS({
            'default': {
                color: {
                    color: this.state.primaryColor
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
                <div className='edit-settings-name-image'>
                    <h1>{this.props.username}</h1>
                    <img className='edit-settings-image' src={this.state.uploadedUrl} alt='Avatar' />
                    <label htmlFor='image_upload'>Upload a new Profile Image</label>
                    <input type='file' onChange={this.fileOnChange} accept='image/*' name='image_upload' id='image_upload' />
                    <input type='hidden' value={this.state.uploadedUrl} />
                </div>
                <div className='edit-settings-color'>
                    <h3>Primary Color</h3>
                    {this.state.displayPicker ? (
                        <div style={ styles.popover }>
                            <div style={ styles.cover } onClick={ this.handleColorClose }/>
                            <SketchPicker color={ this.state.primaryColor } onChange={ this.handleColorChange } />
                        </div>
                    ) : null}
                    <span style={styles.color} onClick={this.handleColorClick}>{this.state.primaryColor}</span>
                    <button onClick={this.submit} >Save Changes</button>
                </div>
            </div>
        )
    }
}

const checkout = state => ({
    id: state.ur.id,
    username: state.ur.username,
    primaryColor: state.ur.primaryColor,
    profileImgUrl: state.ur.profileImgUrl
})

export default connect(checkout, {updateSettings})(withRouter(EditSettings))