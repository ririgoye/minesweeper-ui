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
            allButtons: [],
            id: 1,
            userId: 1,
            elapsedTime: 0,
            rows: 5,
            columns: 5,
            mines: 6,
            size: 25,
            layout: "122101MM21135M301MMM01232",
            state: "HHHHHHHHHHHHHHHHHHHHHHHHH",
            status: "PAUSED",
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
            let cellText = this.getCellText(i, state, layout);
            buttons.push(<GameButton key={"btn-" + i} value={i} onPress={op}>{cellText}</GameButton>);
        }
        console.log(buttons);
        //This is not working on new games
        this.setState({ allButtons: buttons });
        //this.state.allButtons = buttons;
        console.log(this.state.allButtons);
        this.setState(this.state);
    }


    updateButtons() {
        const { allButtons, size, state, layout } = this.state;
        let op = (cell) => this.clickButton(cell);
        for (var i = 0; i < size; i++) {
            let cellText = this.getCellText(i, state, layout);
            let oldVal = allButtons[i].props.children;
            if (oldVal !== cellText) {
                //it is not possible to modify button's text. We have to recreate the button instead
                allButtons[i] =  <GameButton key={"btn-" + i} value={i} onPress={op}>{cellText}</GameButton>
            }
        }
        //Refresh buttons
        this.setState(this.state);
    }

    getCellText(cell, state, layout) {
        let cellText = state[cell];
        if (cellText === ' ') {
            //if the cell is visible/transparent show what's behind
            cellText = layout[cell];
            if (cellText === '0')
                cellText = ' ';
        }
        else if (cellText === 'H')
            cellText = ".";
        return cellText;
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

        fetch(process.env.REACT_APP_API_HOST +"/api/v1/games", requestOptions)
            .then(response => response.text())
            .then(result => {
                this.loadGameBoard(result);
                //Create new buttons
                this.createButtons();
            })
            .catch(error => console.log('error', error));
        
    }
    startTimer() {
        if (this.timer === undefined)
            this.timer = setTimeout(() => this.checkTimer(), 1000);
    }

    checkTimer() {
        this.timer = undefined;
        const { elapsedTime, status } = this.state;
        this.setState({ elapsedTime: elapsedTime + 1 });
        if (status === "STARTED")
            this.startTimer();
    }

    clickCell(cell,action) {
        const {id} = this.state;

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({ "userId": 1, "action": action, "cell": cell });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_HOST+"/api/v1/games/" + id +"/action", requestOptions)
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
        const { startTime, status } = this.state;
        if (status === "STARTED") {
            let startDate = Date.parse(startTime);
            let endDate = new Date();
            let timeDiff = Math.floor((endDate - startDate) / 1000);
            this.setState({ elapsedTime: timeDiff });
            this.startTimer();
        }
        else
            this.timer = undefined;
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
        const { elapsedTime, rows, columns, allButtons } = this.state;
        let width = 80 * columns;
        let height = 104 * rows;
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