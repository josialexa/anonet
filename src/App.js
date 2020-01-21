import React, {Component} from 'react';
import {HashRouter as Router} from 'react-router-dom'
// import io from 'socket.io-client'
// import {connect} from 'react-redux'
// import {setIo} from './redux/reducers/userReducer'
import routes from './routes'
import './App.css';

export default class App extends Component {
//   constructor() {
//     super()

//     this.state = {
//       io: io('http://172.31.99.73:4000')
//     }
//   }

  // componentDidMount() {
  //   this.props.setIo(this.state.io)
  // }

  render() {
    return (
      <div className="App">
        <Router>
          {routes}
        </Router>
      </div>
    )
  }
}

// export default connect(undefined, {setIo})(App)
