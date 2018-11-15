import React, { Component } from 'react';

class SquareObsolete extends Component {
  //Class, or components in ReactJS meaning, without constructor are stateless functional components
  //Stateless functional components are components that only consist of a render method
  //Instead of extending React.Component we can simply write a function that takes props and return what should be rendered see Square function
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

function Square(props) {        
  return (
    <button className={props.winner  ? "winner square" : "square"} onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

function UndoButton(props){
  return(
    <button className="undo-button action-button" onClick={() => props.onClick()}>
      <FAIcont iconName="undo" />
    </button>
  );
}

function ResetButton(props){
  return(
    <button className="reset-button action-button" onClick={() => props.onClick()}>
      <FAIcont iconName="times" />
    </button>
  );
}

function SortButton(props){
  return(
    <button className="sort-button action-button" onClick={() => props.onClick()}>
      <FAIcont iconName="sort" />
    </button>
  );
}

function SpecialThanks(){
  /*return(
    <div className="special-thanks">
      Thanks Vale <FAIcont iconName="heart red" />
    </div>
  );*/
  return(<div></div>);
}

function FAIcont(props){
  let composedClassName = "fa fa-" + props.iconName;
  return(
    <i className={composedClassName} aria-hidden="true"></i>
  );
}

class Board extends Component {
  renderSquare(i) {
    let a,b,c;
    let isWinnerSquare = false;
    if(this.props.winner){
      a = this.props.winner[0];
      b = this.props.winner[1];
      c = this.props.winner[2];
      isWinnerSquare = i === a || i === b || i === c;
    }
    return <Square key={i} value={this.props.squares[i]} winner={isWinnerSquare} onClick={() => this.props.onClick(i)}/>;
  }

  render() {
    let boardRow = [0,3,6];        
    let rowSquares = Array(3).fill(null);

    return (
      <div>
        {
          boardRow.map((r, i) => {
            return(
              <div key={r} className="board-row">
                {rowSquares.map((s, a) => {
                  return( 
                    this.renderSquare(r + a)
                  );
                })}
              </div>
            );
          })
        }
      </div>
    );
  }
}

//You can use the entire namespace "Reac.Component" or just Component 'cuz declared at the begin
class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
      winner: Array(3).fill(null),
      reverseHistory: false
    };
  }

  handleHistorySort(){
    this.setState({reverseHistory: !this.state.reverseHistory});
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    const winner = calculateWinner(squares);

    this.setState({winner: winner});

    if(winner || squares[i])
      return;
    
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length      
    });
  }

  jumpTo(step) {
    let cuttedHistory = this.state.history.slice(0, step + 1);

    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
      history: cuttedHistory
    });
  }

  handleUndo(){
    if(this.state.stepNumber <= 0)
      return;

    let previousStep = this.state.stepNumber - 1;
    let history = this.state.history.slice(0, previousStep + 1);
    this.setState({
      stepNumber: previousStep,
      xIsNext: (previousStep % 2) ? false : true,
      history: history
    });
  }

  render() {
    const history = this.state.history.slice();
    const current = history[this.state.stepNumber];
    const squares = current.squares;
    const winner = calculateWinner(squares);
    let status;
    if(winner){
      status = "The Winner is: " + winner;
    }else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O'); 
    } 
    
    let moves = history.map((step, move) => {
      const desc = move ? 'Move #' + move : 'Game start';
      //Each element in an array or iterator should have a unique key property 
      //Key are needed in ReactJS to tell core which element need to be updated, created or destroied 
      //Component keys don't need to be globally unique, only unique relative to the immediate siblings
      return (
        <li key={move} className={move === this.state.stepNumber ? "active move" : "move"}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a> 
        </li>
      );
    });

    if(this.state.reverseHistory)
      moves = moves.reverse();

    return (
      <div>
        <div className="game">        
          <div className="game-board">
            <Board squares={squares} winner={winner} onClick={(i) => this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div className="game-status">{status}</div>
            <UndoButton onClick={() => this.handleUndo()} />
            <ResetButton onClick={() => this.jumpTo(0)} />
            <SortButton onClick={() => this.handleHistorySort()} />
            <ol>{moves}</ol>
          </div>        
        </div>      
        <SpecialThanks />
      </div>
    );
  }
}

export default Game;

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
      return lines[i];
    }
  }
  return null;
}