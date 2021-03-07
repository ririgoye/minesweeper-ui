import React, { Component } from 'react';
import Game from "./component/Game";
import Header from "./component/AppHeader";
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header />
                <div id="wrapper">
                    <Game />
                </div>
            </div>);
    }
}

export default App;