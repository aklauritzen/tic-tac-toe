// TODO: #2 Share app via Netlify
// TODO: #3 Update readme.md
// TODO: #4 Display the location for each move in the format (col, row) in the move history list.
// TODO: #5 Bold the currently selected item in the move list.
// TODO: #6 Rewrite Board to use two loops to make the squares instead of hardcoding them.
// TODO: #7 Add a toggle button that lets you sort the moves in either ascending or descending order.
// TODO: #8 When someone wins, highlight the three squares that caused the win.
// TODO: #9 When no one wins, display a message about the result being a draw.

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
    renderSquare(i) {
        // Takes value (i) from the square array.
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
  
    render() {
        return (
            <div>                
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
            history: [{
                // Create an array with nine items with the value null
            squares: Array(9).fill(null)
            }],          

            // Indicate what step we are currently viewing
            stepNumber: 0,

            // X is starting
            xIsNext: true,
        };
    }

    handleClick(i) {
        // If we "go back in time" and make a new move from that point, we now throw all the past future away
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];

        // Creates a copy (slice) of squares array to modify instead of the existing array
        // Keeps immutability
        const squares = current.squares.slice();
        
        // ignore click, if somehone has won or if Square is already filled
        if(calculateWinner(squares) || squares[i]) {
            return;
        }

        // Flips X and O
        squares[i] = this.state.xIsNext ? 'X' : 'O';        

        this.setState({
            history: history.concat([{ // concat() doesn't mutate like push()
                squares: squares,
            }]),        
            stepNumber: history.length,    
            xIsNext: !this.state.xIsNext, // set xIsNext to opposite
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,

            // If stepNumber is even, then xIsNext is set to true
            xIsNext: (step % 2) === 0,
        });
    }
    
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move # ' + move :
                'Go to game start';
            return (
                // "Move" serves as key for history
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;

        if(winner) {
            status = "Winner: " + winner;
        } else {
            // Next player based on xIsNext
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}  

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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