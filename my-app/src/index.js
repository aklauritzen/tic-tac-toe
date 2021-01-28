// TODO: #3 Update readme.md
// TODO: #8 When someone wins, highlight the three squares that caused the win.
// TODO: #16 Restart game button

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
        const squares = [];
        let totalCol = 0;        
        for(let row = 0; row < 3; row++) {            
            const boardRow = [];
            for(let col = 0; col < 3; col++) {                
                boardRow.push(<span key={totalCol}>{this.renderSquare(totalCol)}</span>)
                totalCol++;
            }
            squares.push(<div key={row} className="board-row">{boardRow}</div>)
        };

        return (
            <div>
                {squares}
            </div>
        );
    };    
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
                squares: Array(9).fill(null), 
                
                // Default col and row
                col: null,
                row: null
            }],          

            // Indicate what step we are currently viewing
            stepNumber: 0,

            // X is starting
            xIsNext: true,

            // Sort direction ("asc" / "desc")
            nextSortDirection: "desc",
        };
    }

    handleSquareClick(i) {
        // If we "go back in time" and make a new move from that point, we then throw all the past future away
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];

        // Creates a copy (slice) of squares array to modify instead of the existing array
        // Keeps immutability
        const squares = current.squares.slice();
              
        // Finds row and col from i
        const rowAndCol = findRowAndCol(i)

        // Ignore click, if someone has won or if Square is already filled (starting with null, so false from start)
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
                row: rowAndCol[0],
                col: rowAndCol[1],
            }]),

            // Update stepnumber according to history length
            stepNumber: history.length,   
            
            // set xIsNext to opposite 
            xIsNext: !this.state.xIsNext, 
        });
    }

    jumpTo(step) {       
        this.setState({
            stepNumber: step,
            // If stepNumber is even, then xIsNext is set to true
            xIsNext: (step % 2) === 0,
        });
    }
    
    changeSortDirection() {
        //  Flip asc / desc 
        const direction = (this.state.nextSortDirection === "desc") ? "asc" : "desc";
        this.setState({
            nextSortDirection: direction,
        })
    }

    restartGame() {
        console.log("restart game");
     
        // TODO: Find a way to reset the this.state. Maybe save the initial values, and recall them on click?

    }
    
    render() {
        /*
            "history" is an object with arrays as values
                0:  squares: [null, null, null, null, null, null, null, null, null]
                    col: null
                    row: null
                1:  squares: ["X", null, null, null, null, null, null, null, null]
                    col: 1
                    row: 1
                2:  squares: ["X", "O", null, null, null, null, null, null, null]
                    col: 2
                    row: 1
        */
        const history = this.state.history;
              
        
        /*
            "current" is an object with the current array as value
                1:  squares: ["X", null, null, null, null, null, null, null, null]
                    col: 1
                    row: 1
        */        
        const current = history[this.state.stepNumber];
        const winnerOrTie = calculateWinner(current.squares, this.state.stepNumber);

        /*
            "moves" is an object with elements thats rendered each time a button is clicked.
            
            Map calls function on all elements in history.
            
            "move" serves as key for history
        */
        const moves = history.map((step, move) => {
        
            // Step is the current object
                // step.col, step.row, step.

            // Highlights the current botton
            let currentButton = (move === this.state.stepNumber ? 'currentButton' : '')

            // Move starts at 0, so it is false, and desc will be "Go to game start" else "Go to move # 1..."            
            const description = move ?
                'Go to move # ' + move + " (col " + step.col + " / row " + step.row + ")":
                'Go to game start';                
            
            return (                               
                <div key={move}>
                    <button 
                        className={currentButton}
                        onClick={() => this.jumpTo(move)}>{description}
                    </button>
                </div>
            );
        });

        // Reversing moves
        const reversedMoves = moves.slice().reverse()
                            
        let status;
        if(winnerOrTie) {
            status = winnerOrTie;
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
                        onClick={(i) => this.handleSquareClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div className="status-text">{status}</div>
                    <div className="game-info-navigation">
                        <button onClick={() => this.changeSortDirection()}>Change sorting to: {this.state.nextSortDirection}</button>
                        <button onClick={() => this.restartGame()}>Restart game</button>
                    </div>
                    <div className="step-buttons">{((this.state.nextSortDirection === "desc") ? moves : reversedMoves)}</div>
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

// Returns row and col num
function findRowAndCol(i) {
    let row;
    let col;
  
    // Find row
    if(i < 3) { row = 1 };
    if(i > 2 && i < 6) { row = 2 };
    if(i > 5) { row = 3 };  
    
    // Find col
    if(i === 0 || i === 3 || i === 6) { col = 1 };
    if(i === 1 || i === 4 || i === 7) { col = 2 };
    if(i === 2 || i === 5 || i === 8) { col = 3 };

    return [row, col];
}

function calculateWinner(squares, step) {   
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

            // Returns winner: X / O
            return squares[a] + " is the Winner";
        }
    }

    // If it is a tie
    if(step === 9) {
        return "IT'S A TIE";
    }

    return null;
} 