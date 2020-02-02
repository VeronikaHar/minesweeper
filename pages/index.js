import React from 'react';
import Layout from '../components/layout';

// game components
import Desk from '../components/desk';
import Square from '../components/square';
import Mine from '../components/mine';
import Flag from '../components/flag';

export default class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  /** initializes state */
  state = {
    mines: 10,
    boardSize: 10,
    mineIndeces: [],
    mineCoord: [],
    flagIndeces: [],
    bombClicked: false,
    board: []
  }

  //create an array of Square elements
  createBoard() {
    let squareArr = [];
    for (let i = 0; i < (this.state.boardSize * this.state.boardSize); i++) {
      let y = Math.floor(i / this.state.boardSize),
        x = i - (this.state.boardSize * y);
      squareArr.push(
        <Square
          key={i}
          disabled={this.state.bombClicked ? i + 1 : "" || this.state.board[0] && this.state.board[x][y].isRevealed ? this.state.board[x][y] : ""}
          onClick={() => this.handleRightClick(i, x, y)}
          onContextMenu={(e) => {
            //prevent left click default menu from opening
            e.preventDefault(),
              this.handleLeftClick(i)
          }}
        >
          {this.state.mineIndeces.includes(i) && this.state.bombClicked ? <Mine /> : ""}
          {this.state.board[0] && this.state.board[x][y].isRevealed ? this.state.board[x][y].value : ""}
          {this.state.flagIndeces.includes(i) && !this.state.bombClicked ? <Flag /> : ""}
        </Square>)
    }
    return squareArr;
  }

  //initializes a two dimensional board with bombs placed and all the cell values filled out
  initBoard(boardSize, mineCoord) {
    const board = [];
    for (let i = 0; i < boardSize; i++) {
      board[i] = [];
      for (let j = 0; j < boardSize; j++) {
        board[i][j] = {
          isRevealed: false,
          value: "",
          x: i,
          y: j,
        };
      }
    }

    //place bombs
    mineCoord.forEach(mine => {
      board[mine.x][mine.y].value = "Mine";
    });

    //fill out remaining cells with values
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (board[i][j].value !== "Mine") {
          const mineCount = this.countMines(board, i, j);
          board[i][j].value = mineCount;
        } else { continue }
      }
    }

    this.setState({ board })
  }

  //count mines in neighbouring cells
  countMines(board, x, y) {
    let mineCount = 0;

    //loop through all adjacent cells
    for (let i = x - 1; i < x + 2; i++) {
      for (let j = y - 1; j < y + 2; j++) {

        //check whether coordinates are valid
        if (this.state.boardSize > i && i > -1 &&
          this.state.boardSize > j && j > -1) {
          if (board[i][j].value == "Mine") { mineCount++; }
        } else { continue }
      }
    }
    return mineCount;
  }

  //handle left click
  handleLeftClick(i) {
    const index = this.state.flagIndeces.indexOf(i);
    if (index > -1) {
      this.state.flagIndeces.splice(index, 1);
      this.setState({ flagIndeces: this.state.flagIndeces });
    } else {
      this.setState({ flagIndeces: [...this.state.flagIndeces, i] })
    }
  }

  //handle right click
  handleRightClick(i, x, y) {
    if (this.state.mineIndeces.includes(i)) {
      this.setState({ bombClicked: true });
    } else {
      this.revealCell(x, y);

      //when cell value is 0, reveal its neighbouring cells
      if (this.state.board[x][y].value === 0) {
        for (let i = x - 1; i < x + 2; i++) {
          for (let j = y - 1; j < y + 2; j++) {

            //check whether coordinates are valid
            if (this.state.boardSize > i && i > -1 &&
              this.state.boardSize > j && j > -1) {
              this.revealCell(i, j);
            } else { continue }
          }
        }
      }
    }
  }

  //return a number of mines in neighbouring cells
  revealCell(x, y) {
    let board = { ...this.state.board };

    board[x][y].isRevealed = true;
    this.setState({ board });
  }

  //assign random indeces from the board to mines and get mine coordinates on the board
  placeMine = () => {
    let mineIndeces = [];
    for (let i = 0; mineIndeces.length < this.state.mines; i++) {
      let index = Math.floor(Math.random() * this.state.boardSize * this.state.boardSize);
      if (mineIndeces.indexOf(index) === -1) {
        mineIndeces.push(index);
      }
    }

    let mineCoord = [];
    for (let i = 0; i < mineIndeces.length; i++) {
      let y = Math.floor(mineIndeces[i] / this.state.boardSize),
        x = mineIndeces[i] - (this.state.boardSize * y);
      mineCoord.push({ x, y })
    }

    this.setState({ mineCoord, mineIndeces });
  }

  componentWillMount() {
    this.placeMine();
  }

  componentDidMount() {
    this.initBoard(this.state.boardSize, this.state.mineCoord)
  }

  render() {
    return (
      <Layout title={`Minesweeper (active)`}>
        <Desk boardSize={this.state.boardSize}>
          {this.createBoard()}
          {console.log(this.state)}
        </Desk>
      </Layout>
    )
  }
}