import React from 'react';
// import Register from './components/Register/Register'
// import Login from './components/Login/Login'
import {HashRouter as Router} from 'react-router-dom'
import routes from './routes'
import './App.css';

function App() {
  const processFile = (e) => {
    const files = e.target.files
    const file = files[0]
    if(file == null) {
      alert('no file selected')
    } else {
      console.log(file)
    }
  }

  return (
    <div className="App">
      {/* <input type='file' onChange={processFile} /> */}
      {/* <Register /> */}
      {/* <Login /> */}
      <Router>
        {routes}
      </Router>
    </div>
  );
}

export default App;
