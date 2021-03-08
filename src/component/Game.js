import React, { Component } from 'react';
import PointTarget from 'react-point';

class GameDisplay extends Component {
    render() {
        const { onNewGame, onPauseGame, onToogleFlag, value, status, showFlag, ...props } = this.props
        let face = status === "WON" ? "=)" : "=(";
        let gameDone = status === "WON" || status === "LOST";
        let showNew = status === "" || gameDone;
        let showPlay = status !== "STARTED";
        return (
            <div {...props} className="game-display">
                <div className="game-displayitem">
                    {showNew && (
                        <PointTarget onPoint={onNewGame}>
                            <label tag="New Game">+</label>
                        </PointTarget>
                    )}
                    {!showNew && (
                        <PointTarget onPoint={onNewGame}>
                            <label title="Restart Game" style={{ position: `relative`, bottom: `10px` }}>«</label>
                        </PointTarget>
                    )}
                </div>
                <div className="game-displayitem">{value}</div>
                {!showNew && (
                    <div className="game-displayitem">
                        {!showPlay && (
                            <PointTarget onPoint={onPauseGame}>
                                <label title="Pause Game" style={{ position: `relative`, bottom: `10px` }}>■</label>
                            </PointTarget>
                        )}
                        {showPlay && (
                            <PointTarget onPoint={onPauseGame}>
                                <label title="Continue Game">&gt;</label>
                            </PointTarget>
                        )}
                    </div>
                )}
                {!showNew && (
                    <div className="game-displayitem">
                        {showFlag && (
                            <PointTarget onPoint={onToogleFlag}>
                                <label title="Place flags">F</label>
                            </PointTarget>
                        )}
                        {!showFlag && (
                            <PointTarget onPoint={onToogleFlag}>
                                <label title="Click cell">X</label>
                            </PointTarget>
                        )}
                    </div>
                )}
                {gameDone && (
                    <div className="game-displayitem">
                        <label>{face}</label>
                    </div>
                )}
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

class NumSelector extends Component {
    constructor(props) {
        super(props);
        let options = [];
        for (var i = props.min; i < props.max; i++) {
            options.push(<option key={"k-" + i} value={i}>{i}</option>)
        }
        this.state = {
            min: props.min,
            max: props.max,
            value: props.value,
            options: options
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        let val = event.target.value
        console.log("val changed" + val);
        if (this.props.onChange) {
            this.props.onChange(val);
        }
        this.setState({ value: val });
    }

    render() {
        const { options } = this.state;
        return (
            <select value={this.state.value} onChange={this.handleChange}>
                {options}
            </select>
        )
    }
}


class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allButtons: [],
            id: 0,
            userId: props.userId,
            elapsedTime: 0,
            rows: 6,
            columns: 6,
            ddRows: 6,
            ddColumns: 6,
            mines: 7,
            size: 25,
            layout: "",
            state: "",
            status: "",
            startTime: "",
            localElapsedTime: 0,
            showFlag: false
        };
        //"payload": { "id": 1, "userId": 1, "rows": 5, "columns": 5, "mines": 6, "layout": "122101MM21135M301MMM01232", "state": "HHHHHHHHHHHHHHHHHHHHHHHHH", "status": "STARTED", "startTime": "2021-03-08T01:06:47.571142", "elapsedTime": 0, "size": 25 }
        this.loadLastGame();

        this.rowsChanged = this.rowsChanged.bind(this);
        this.colsChanged = this.colsChanged.bind(this);
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
                allButtons[i] = <GameButton key={"btn-" + i} value={i} onPress={op}>{cellText}</GameButton>
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
        const { showFlag } = this.state;        
        this.sendAction(cell, showFlag?"FLAG":"CLICK");
    }

    createGame() {
        //Using the rows and columns from the dropdowns. The real row/columns from state will be updated on the callback
        const { userId, ddRows, ddColumns } = this.state;
        //mines are fixed to %20 of the board
        let mines = Math.floor(ddRows * ddColumns * .2);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({ "userId": userId, "rows": ddRows, "columns": ddColumns, "mines": mines });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_HOST + "/api/v1/games", requestOptions)
            .then(response => response.text())
            .then(result => {
                this.loadGameBoard(result, "YES");
                //Create new buttons
                this.createButtons();
            })
            .catch(error => console.log('error', error));
    }

    loadLastGame() {
        const { userId } = this.state;        
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            body: null,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_HOST + "/api/v1/users/" + userId+"/lastgame", requestOptions)
            .then(response => response.text())
            .then(result => {
                this.loadGameBoard(result, "API");
                //Create new buttons
                this.createButtons();
            })
            .catch(error => console.log('error', error));
    }

    startTimer() {
        if (this.timer === undefined) {
            this.timer = setTimeout(() => this.checkTimer(), 1000);
        }
    }

    checkTimer() {
        this.timer = undefined;
        const { localElapsedTime, status } = this.state;
        if (status === "STARTED") {
            //We have a separate elapsed time because, directly using the one from the server, will make the timer flicker.
            this.setState({ localElapsedTime: localElapsedTime + 1 });
            this.startTimer();
        }
    }

    sendAction(cell, action) {
        const { id, userId } = this.state;

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({ "userId": userId , "action": action, "cell": cell });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_HOST + "/api/v1/games/" + id + "/action", requestOptions)
            .then(response => response.text())
            .then(result => {
                this.loadGameBoard(result, "NO");
                //Modify text in existing buttons
                this.updateButtons();
            })
            .catch(error => console.log('error', error));
    }

    loadGameBoard(result, resetTimer) {
        let response = JSON.parse(result);
        let payload = response.payload;

        switch (resetTimer) {
            case "YES":
            case "ZERO":
                payload.localElapsedTime = 0;
                break;
            case "API":
                //get timer from api response
                payload.localElapsedTime = payload.elapsedTime;
                break;
        }
        this.setState(payload);
        this.checkStartTime();
    }

    checkStartTime() {
        const { status, elapsedTime } = this.state;
        if (status === "STARTED") {
            this.startTimer();
        }
        else {
            //Stop the timer
            this.setState({ localElapsedTime: elapsedTime });
            this.timer = undefined;
        }
    }

    newGame() {
        console.log("new game");
        this.createGame();
    }

    pauseGame() {
        const { status } = this.state;
        if (status === "STARTED")
            this.sendAction(0, "PAUSE");
        else
            this.sendAction(0, "RESUME");
    }

    toogleFlag() {
        const { showFlag } = this.state;
        this.setState({ showFlag: !showFlag });
    }

    toogleFlag() {
        const { showFlag } = this.state;
        this.setState({ showFlag: !showFlag });
    }

    rowsChanged(rows) {
        console.log("rows changed" + rows);
        //We just store the value to be used on new game
        this.setState({ ddRows: rows });
    }

    colsChanged(cols) {
        console.log("cols changed" + cols);
        //We just store the value to be used on new game
        this.setState({ddColumns: cols });
    }


    render() {
        const { localElapsedTime, rows, columns, allButtons, status, showFlag } = this.state;
        let width = 80 * columns;
        let height = 80 * rows + 130;
        return (
            <div>
                <div className="dimentions" id="dimentions">
                    <label> Rows:    <NumSelector min={5} max={15} value={5} onChange={this.rowsChanged} />
                        Columns:    <NumSelector min={5} max={15} value={5} onChange={this.colsChanged} />
                    </label>
            </div>
            <div id="game" className="game" style={{ width: `${width}px`, height: `${height}px` }}>
                <GameDisplay value={localElapsedTime} status={status} showFlag={showFlag}
                    onNewGame={() => this.newGame()}
                    onPauseGame={() => this.pauseGame()}
                    onToogleFlag={() => this.toogleFlag()}
                />
                <div className="game-board">
                    <div className="game-buttons">
                        {allButtons}
                    </div>
                    </div>
                </div>
            </div>)
    }
}

export default Game;