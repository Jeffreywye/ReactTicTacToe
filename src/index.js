import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";



// class Square extends React.Component {
  
//   //Square should not keep track of game/board state
//   // constructor(props){
//   //   super(props);
//   //   this.state = {
//   //     value: null,
//   //   };
//   // }


//   render() {
//     return (
//       <button 
//         className="square" 
//         onClick={() => this.props.onClick()}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props){
  return (
    <button
      className="square"
      //note onClick does not have () at the end for fnc comp
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    // Square properties passed down from Game Grandparent
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

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        // create an array of size nine
        // and fill all empty spaces with nulls
        squares: Array(9).fill(null)
      }],
      //move num
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick(i){
    //slice fnc second param is exclued for arrays
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    //make a copy of the squares array from the current game state 
    const squares = current.squares.slice();
    // checks if game should be over 
    // or if square is already filled
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    //change the value at index i 
    squares[i] = this.state.xIsNext ? "X" : "O";
    //set the new array
    this.setState({
      // concat returns a new array that is the merge of
      // arr1 & arr2 in arr1.concat(arr2)
      // concat does not mutate the original array
      history: history.concat([{
        squares: squares
      }]),
      //hist.len is always 1 more than the original step num
      stepNumber: history.length,
      //invert xIsNext
      xIsNext: !this.state.xIsNext
    });
  }

  //go to the board state corresponding to step#
  jumpTo(step){
    this.setState({
      stepNumber: step,
      //revert xIsNext to the correct val for that step
      //xIsNext started as true when step was 0
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares)

    //moves is an array of objs
    //each obj contains a description and a list item
    //val is the corresponding square state
    //index is the corr move
    const moves = history.map( (val, index) => {
      //checks if index is the first move ie index is 0(falsy)
      const description = index ?
        'Go to move #'+ index :
        'Go to game start';
      return (
        // key allows react to distinguish btwn which elem
        // to rerender/update
        // note: key cannot be access with this.props.key
        <li key={index}>
          <button onClick={() => this.jumpTo(index)}>
            {description}
          </button>
        </li>
      );
    });

    let status = 'Next player: '+(this.state.xIsNext ? "X" : "O");
    if(winner){
      status = "Winner " + winner;
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


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
