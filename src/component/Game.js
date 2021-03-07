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
    render() {
        const { onPress, className, ...props } = this.props

        return (
            <PointTarget onPoint={onPress}>
                <button className={`game-button ${className}`} {...props} />
            </PointTarget>
        )
    }
}


class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            elapsedTime: '0'
        };
    }


    clickButton(cell) {
        const { elapsedTime } = this.state
            this.setState({
                elapsedTime: cell
            })        
    }


    render() {
        const { elapsedTime } = this.state;

        return (
            <div id="game" className="game">
                <GameDisplay value={elapsedTime} />
                <div className="game-board">
                    <div className="game-buttons">
                        <GameButton onPress={() => this.clickButton(0)}>0</GameButton>
                        <GameButton onPress={() => this.clickButton(1)}>1</GameButton>
                        <GameButton onPress={() => this.clickButton(2)}>2</GameButton>
                        <GameButton onPress={() => this.clickButton(3)}>3</GameButton>
                        <GameButton onPress={() => this.clickButton(4)}>4</GameButton>
                        <GameButton onPress={() => this.clickButton(5)}>5</GameButton>
                        <GameButton onPress={() => this.clickButton(6)}>6</GameButton>
                        <GameButton onPress={() => this.clickButton(7)}>7</GameButton>
                        <GameButton onPress={() => this.clickButton(8)}>8</GameButton>
                        <GameButton onPress={() => this.clickButton(9)}>9</GameButton>
                        <GameButton onPress={() => this.clickButton(10)}>10</GameButton>
                        <GameButton onPress={() => this.clickButton(11)}>11</GameButton>
                        <GameButton onPress={() => this.clickButton(12)}>12</GameButton>
                        <GameButton onPress={() => this.clickButton(13)}>13</GameButton>
                        <GameButton onPress={() => this.clickButton(14)}>14</GameButton>
                        <GameButton onPress={() => this.clickButton(15)}>15</GameButton>
                        <GameButton onPress={() => this.clickButton(16)}>16</GameButton>
                        <GameButton onPress={() => this.clickButton(17)}>17</GameButton>
                        <GameButton onPress={() => this.clickButton(18)}>18</GameButton>
                        <GameButton onPress={() => this.clickButton(19)}>19</GameButton>
                        </div>
                </div>
            </div>)
    }
}

export default Game;