import React, { Component } from 'react';


class AppHeader extends Component {
    constructor(props) {
        super(props);
        this.state = { userName: "", password: "", userId: 0 };

        this.handleUChange = this.handleUChange.bind(this);
        this.handlePChange = this.handlePChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUChange(event) {
        this.setState({ userName: event.target.value });
    }

    handlePChange(event) {
        this.setState({ password: event.target.value });
    }

    handleSubmit(event) {
        const { userName, password } = this.state;

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({ "name": userName, "password": password });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        //TODO: I should probably move fetch logic to a library
        //create/update user
        fetch(process.env.REACT_APP_API_HOST + "/api/v1/users", requestOptions)
            .then(response => response.text())
            .then(result => {
                let payload = JSON.parse(result).payload;
                console.log(payload);
                this.setState({ userId: payload.id });
                if (this.props.onLogin) {
                    this.props.onLogin(this.state.userId);
                }
            })
            .catch(error => console.log('error', error));
        event.preventDefault();
    }
    render() {
        return (
            <React.Fragment>
                <div>
                    <h1 className="App-title">Minesweeper UI</h1>
                    <div id='forms' className="App-intro">

                        <form onSubmit={this.handleSubmit}>
                            <label>
                                UserName:&nbsp;
                                <input type="text" value={this.state.userName} onChange={this.handleUChange} size={8} />
                                Password:&nbsp;
                                <input type="password" value={this.state.password} onChange={this.handlePChange} size={8} />
                            </label>&nbsp;
                            <input id="login" type="submit" value="Login/SignUp" />
                        </form>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default AppHeader;
