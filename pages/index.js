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
    mines: 5,
    boardSize: 4,
    mineIndeces: [],
    mineCoord: [],
    flagIndeces: [],
    bombClicked: false,
    board: []
  }

  //create a deskboard of assigned size
  createBoard() {
    let squareArr = [];
    for (let i = 0; i < (this.state.boardSize * this.state.boardSize); i++) {
      let y = Math.floor(i / this.state.boardSize),
        x = i - (this.state.boardSize * y);
      squareArr.push(
        <Square
          key={i}
          disabled={this.state.bombClicked ? i + 1 : ""}
          onClick={() => this.handleRightClick(i, x, y)}
          onContextMenu={(e) => {
            //prevent left click default menu from opening
            e.preventDefault(),
              this.handleLeftClick(i)
          }}
        > {i}
          {this.state.mineIndeces.includes(i) && this.state.bombClicked ? <Mine /> : ""}
          {this.state.flagIndeces.includes(i) && !this.state.bombClicked ? <Flag /> : ""}
        </Square>)
    }
    return squareArr;
  }

  //initializes a two dimensional board with bombs placed
  initBoard(boardSize, mineCoord) {
    const board = [];
    for (let i = 0; i < boardSize; i++) {
      board[i] = [];
      for (let j = 0; j < boardSize; j++) {
        board[i][j] = {
          isRevealed: false,
          value: "",
          x: j,
          y: i
        };
      }
    }

    //place bombs
    mineCoord.forEach(mine => {
      board[mine.x][mine.y].value = <Mine />;
    });

    this.setState({ board })
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
      this.setState({ bombClicked: true })
    } else {
      this.revealCell(x, y)
      console.log(this.state.board[x][y])
    }
  }

  //return a number of mines in neighbouring cells
  revealCell(x, y) {
    this.state.board[x][y].isRevealed = true
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