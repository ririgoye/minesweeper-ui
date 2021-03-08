import React, { Component } from 'react';
import PointTarget from 'react-point';

class GameDisplay extends Component {
    render() {
        const { onNewGame, onPauseGame, value, ...props } = this.props

        return (
            <div {...props} className="game-display">
                <div className="game-displayitem">
                    <PointTarget onPoint={onNewGame}>
                        <label tag="New Game">+</label>
                    </PointTarget>
                </div>
                <div className="game-displayitem">{value}</div>
                <div className="game-displayitem">
                    <PointTarget onPoint={onPauseGame}>
                        <label tag="Pause Game">||</label>
                    </PointTarget></div>                
            </div>
        )
    }
}

class GameButton extends Component {
    //This is required so we can pass a parameter to the function
    _onPress() {
        if (this.props.onPress) {
            this.props.onPress(this.props.value);
        }
    }
    render() {
        const { onPress, className, ...props } = this.props;
        return (
            <PointTarget onPoint={() => this._onPress()}>
                <button className={`game-button ${className}`} {...props} />
            </PointTarget>
        )
    }
}


class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 1,
            userId: 1,
            elapsedTime: 0,
            rows: 5,
            columns: 5,
            mines: 6,
            size: 25,
            layout: "122101MM21135M301MMM01232",
            state: "HHHHHHHHHHHHHHHHHHHHHHHHH",
            status: "STARTED",
            startTime: "2021-03-08T01:06:47.571142"
        };
        //"payload": { "id": 1, "userId": 1, "rows": 5, "columns": 5, "mines": 6, "layout": "122101MM21135M301MMM01232", "state": "HHHHHHHHHHHHHHHHHHHHHHHHH", "status": "STARTED", "startTime": "2021-03-08T01:06:47.571142", "elapsedTime": 0, "size": 25 }
        this.createButtons();        
    }

    createButtons() {
        //Creating all the buttons in the constructor to avoid creating objects on every request
        const { size, layout, state } = this.state;
        const buttons = [];
        let op = (cell) => this.clickButton(cell);
        for (var i = 0; i < size; i++) {
            let cellText = state[i];
            if (cellText == ' ') {
                cellText = layout[i];
                if (cellText == '0')
                    cellText = ' ';
            }
            buttons.push(<GameButton key={"btn-" + i} value={i} onPress={op}>{cellText}</GameButton>);
        }
        console.log(buttons);
        if (this.state.allButtons)
            this.setState({ allButtons: buttons });
        else
            this.state.allButtons = buttons;
    }


    updateButtons() {
        const { allButtons, size, state, layout } = this.state;
        let op = (cell) => this.clickButton(cell);
        for (var i = 0; i < size; i++) {
            let cellText = state[i];
            if (cellText == ' ') {
                cellText = layout[i];
                if (cellText == '0')
                    cellText = ' ';
            }
            let oldVal = allButtons[i].props.children;
            if (oldVal != cellText) {
                console.log(oldVal + " " + cellText);
                allButtons[i] =  <GameButton key={"btn-" + i} value={i} onPress={op}>{cellText}</GameButton>
            }
        }
        //Refresh buttons
        this.setState(this.state);
    }

    clickButton(cell) {
        this.clickCell(cell, "CLICK");
    }

    createGame() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({ "userId": 1, "rows": 6, "columns": 6, "mines": 6 });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:8080/api/v1/games", requestOptions)
            .then(response => response.text())
            .then(result => {
                this.loadGameBoard(result);
                //Create new buttons
                this.createButtons();
            })
            .catch(error => console.log('error', error));
    }

    clickCell(cell,action) {
        const {id} = this.state;

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({ "userId": 1, "action": action, "cell": cell });
        console.log(raw);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:8080/api/v1/games/" + id +"/action", requestOptions)
            .then(response => response.text())
            .then(result => {
                this.loadGameBoard(result);
                //Modify text in existing buttons
                this.updateButtons();
            })
            .catch(error => console.log('error', error));
    }

    loadGameBoard(result) {
        let response = JSON.parse(result);
        let payload = response.payload;
        this.setState(payload);
        this.checkStartTime();
    }

    checkStartTime() {
    }

    newGame() {
        console.log("new game");
        this.createGame();
    }

    pauseGame() {
        console.log("pause game");
        this.createButtons();
    }

    render() {
        const { elapsedTime, rows, columns, size, allButtons, layout } = this.state;
        console.log(layout);
        let width = 80 * columns;
        let height = 104 * rows;
        console.log(allButtons);
        return (
            <div id="game" className="game" style={{ width: `${width}px`, height: `${height}px` }}>
                <GameDisplay value={elapsedTime} onNewGame={() => this.newGame()} onPauseGame={() => this.pauseGame()} />
                <div className="game-board">
                    <div className="game-buttons">
                        {allButtons}
                    </div>
                </div>
            </div>)
    }
}

export default Game;