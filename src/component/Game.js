import React, { Component } from 'react';
import PointTarget from 'react-point';

class GameDisplay extends Component {
    render() {
        const { value, ...props } = this.props

        return (
            <div {...props} className="game-display">
                <div className="game-displayitem">-</div>
                <div className="game-displayitem">{value}</div>
                <div className="game-displayitem">-</div>                
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
        const { onPress, className, ...props } = this.props
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
            elapsedTime: 0,
            rows: 5,
            columns: 5,
            size: 25
        };

        this.createButtons();        
    }

    createButtons() {
        //Creating all the buttons in the constructor to avoid creating objects on every request
        const allButtons = [];
        let op = (cell) => this.clickButton(cell);
        for (var i = 0; i < this.state.size; i++) {
            console.log(i);
            allButtons.push(<GameButton key={"btn-" + i} value={i} onPress={op}>{i}</GameButton>);
        }
        this.state.allButtons = allButtons;
    }

    clickButton(cell) {
        const { elapsedTime } = this.state
            this.setState({
                elapsedTime: cell
            })        
    }

    render() {
        const { elapsedTime, rows, columns, size, allButtons } = this.state;
        let width = 80 * columns;
        let height = 104 * rows;
        return (
            <div id="game" className="game" style={{ width: `${width}px`, height: `${height}px` }}>
                <GameDisplay value={elapsedTime} />
                <div className="game-board">
                    <div className="game-buttons">
                        {allButtons}
                    </div>
                </div>
            </div>)
    }
}

export default Game;