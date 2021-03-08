import React, { Component } from 'react';
import Game from "./component/Game";
import Header from "./component/AppHeader";
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { userId: 0 };
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(userId) {
        console.log("got id: " + userId);
        //copy userId from header to this module so it can be used by the game
        this.setState({ userId: userId });
    }

    render() {
        const { userId } = this.state;
        return (
            <div className="App">
                <Header onLogin={this.handleLogin} />
                <div id="wrapper">
                    {userId > 0 && (
                        <Game userId={userId} />
                    )}
                </div>
            </div>);
    }
}

export default App;