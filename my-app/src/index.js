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

    // Renders the board with nine squares
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
  
// Renders board element with placeholder values
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

        // Initial state
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
        // If we "go back in time" and make a new move from that point, we then throw all the past future away
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];

        // Creates a copy (slice) of squares array to modify instead of the existing array
        // Keeps immutability
        const squares = current.squares.slice();
        
        // ignore click, if someone has won or if Square is already filled (starting with null, so false from start)
        if(calculateWinner(squares) || squares[i]) {
            return;
        }

        // Flips X and O turn
        squares[i] = this.state.xIsNext ? 'X' : 'O';   
        
        // Tells React that this component and its children need to be re-rendered with the updated state
        this.setState({
            // Concat() doesn't mutate like push()
            history: history.concat([{ 
                squares: squares,
            }]),

            // Update stepnumber according to history length
            stepNumber: history.length,   

            // set xIsNext to opposite 
            xIsNext: !this.state.xIsNext, 
        });
    }

    jumpTo(step) {
        console.log("step: " + step);
       
        this.setState({

            buttonColor: "red",

            stepNumber: step,
            // If stepNumber is even, then xIsNext is set to true
            xIsNext: (step % 2) === 0,
        });
    }
    
    render() {
        /*
            "history" is an object with arrays as values
                0: squares: [null, null, null, null, null, null, null, null, null]
                1: squares: ["X", null, null, null, null, null, null, null, null]
                2: squares: ["X", "O", null, null, null, null, null, null, null]
        */
        const history = this.state.history;

        /*
            "current" is an object with the current array as value
                1: squares: ["X", null, null, null, null, null, null, null, null]
        */        
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        


        

        /*
            "moves" is an object with elements thats rendered each time a button is clicked.
            
            Map calls function on all elements in history.
            
            "move" serves as key for history
        */
        const moves = history.map((step, move) => {

            // Highlights the current botton
            let currentButton = (move === this.state.stepNumber ? 'currentButton' : '')

            // Move starts at 0, so it is false, and desc will be "Go to game start" else "Go to move # 1..."
            const desc = move ?
                'Go to move # ' + move :
                'Go to game start';                
            
            return (                               
                <li key={move}>
                    <button 
                        className={currentButton}
                        onClick={() => this.jumpTo(move)}>{desc}
                    </button>
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

                        // Board passes the function "handleClick(i) to Square, so Square calls that function when it's clicked"
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

// Renders a React element "Game" in the container 'root'
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