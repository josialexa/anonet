import React, { Component } from 'react'
import './Loading.css'

export default class Loading extends Component {
    constructor() {
        super()

        this.state = {
            intervalId: null
        }
    }

    componentDidMount() {
        const canvas = document.getElementById('loading-canvas')
        const ctx = canvas.getContext('2d')
        let counter = 0
        const r = 150
        canvas.height = window.innerHeight
        canvas.width = window.innerWidth
        ctx.fillStyle = "black"

        const i = setInterval(() => {
            ctx.beginPath()
            ctx.arc(window.innerWidth / 2, window.innerHeight / 2, r, counter, counter + (Math.PI / 8))
            ctx.fill()
            counter += (Math.PI / 8)
            if(counter > (2 * Math.PI) + .125) {
                ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
                counter = 0
            }
        }, 35)

        this.setState({
            interval: i
        })
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId)
        this.setState({
            interval: null
        })
        console.log('interval cleared!')
    }

    render() {
        return (
            <div id='canvas-container'>
                <canvas id='loading-canvas'></canvas>
            </div>
        )
    }
}
