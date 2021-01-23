// TODO: #2 Share app via Netlify
// TODO: #3 Update readme.md

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Renders a button
function Square(props) {
    return (
        // Board passes onClick={() => this.handleClick(i)} to square.
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}
  
// Renders the board with nine squares
class Board extends React.Component {
    constructor(props) {
        super(props);
        
        // Stores the state of all child components (squares)
        // When the board state changes, the square components re-render automatically.
        /*
            'O', null, 'X',
            'X', 'X', 'O',
            'O', null, null,
        */
        this.state = {
            // Create an array with nine items with the value null
            squares: Array(9).fill(null),

            // X is starting
            xIsNext: true,
        };
    }
    
    handleClick(i) {
        // Creates a copy (slice) of squares array to modify instead of the existing array.
        // Keeps immutability
        const squares = this.state.squares.slice();

        // ignore click, if somehone has won or if Square is already filled.
        if(calculateWinner(squares) || squares[i]) {            
            return;
        }

        // Flips X and O
        squares[i] = this.state.xIsNext ? 'X' : 'O';        

        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext, // set xIsNext to opposite
        });
    }

    renderSquare(i) {
        // Takes value (i) from the square array.
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }
  
    render() {
        const winner = calculateWinner(this.state.squares);
        let status;

        if(winner) {
            status = "Winner: " + winner;
        } else {
            // Next player based on xIsNext
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
  
        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
            <div className="board-row">
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
            </div>
            <div className="board-row">
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
            </div>
        </div>
        );
    }
}
  
// Renders board with placeholder values
class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}  

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);