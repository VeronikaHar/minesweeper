import React from 'react';

// game components
import Layout from '../components/layout';
import Desk from '../components/desk';
import Square from '../components/square';
import Mine from '../components/mine';
import Flag from '../components/flag';
import Button from '../components/button';

export default class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  // initialize state
  state = {
    mines: 10,
    boardSize: 10,
    newSize: 10,
    mineIndeces: [],
    mineCoord: [],
    flagIndeces: [],
    bombClicked: false,
    board: [],
    gameStatus: "(active)",
    minesLeft: 0
  }

  //assign random indeces from the board to mines, get mine coordinates on the board and trigger board initialization
  placeMines = () => {
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

    this.setState({ mineCoord, mineIndeces, mineCount: this.state.mines, board: [], bombClicked: false, flagIndeces: [], gameStatus: "(active)", }, () => { this.initBoard(this.state.newSize) });
  }

  //initialize a two dimensional board with bombs placed and all the cell values filled out
  initBoard = (boardSize) => {
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
    this.state.mineCoord.forEach(mine => {
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

  //create an array of functional Square elements
  createBoard(boardSize) {

    //create the board only after it was initialized with the new size
    if (this.state.board[boardSize - 1]) {
      let squareArr = [];
      for (let i = 0; i < (boardSize * boardSize); i++) {
        let y = Math.floor(i / boardSize),
          x = i - (boardSize * y);
        squareArr.push(
          <Square
            key={i}
            disabled={this.state.bombClicked ? i + 1 : "" || this.state.board[x][y].isRevealed ? this.state.board[x][y] : ""}
            onClick={() => this.handleRightClick(i, x, y)}
            onContextMenu={(e) => {
              e.preventDefault(),
                this.handleLeftClick(i)
            }}
          >
            {this.state.mineIndeces.includes(i) && this.state.bombClicked ? <Mine /> : ""}
            {this.state.board[x][y].isRevealed ? this.state.board[x][y].value : ""}
            {this.state.flagIndeces.includes(i) && !this.state.bombClicked ? <Flag /> : ""}
          </Square>)
      }
      return squareArr;
    }
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

  //handle left click by placing or removing a flag and counting mines
  handleLeftClick(i) {
    const index = this.state.flagIndeces.indexOf(i);
    if (index > -1) {
      this.state.flagIndeces.splice(index, 1);
      this.setState({ flagIndeces: this.state.flagIndeces });
    } else {
      this.setState({ flagIndeces: [...this.state.flagIndeces, i] })
    };
    this.setState({ mineCount: this.state.mines - this.state.flagIndeces.length - 1 })
  }

  //handle right click by revealing the cell and its neighbours, when cell value is 0
  handleRightClick(i, x, y) {
    if (this.state.mineIndeces.includes(i)) {
      this.setState({ bombClicked: true, gameStatus: "(game over)" });
      alert("Bang! You lost...");
    } else {
      this.revealCell(x, y);

      //when cell value is 0, reveal its neighbouring cells
      if (this.state.board[x][y].value === 0) {
        this.revealEmpty(x, y);
      }
    }

    //check whether all cells without mines revealed
    this.gameWon();
  }

  //return a number of mines in neighbouring cells
  revealCell(x, y) {
    let board = { ...this.state.board };

    board[x][y].isRevealed = true;
    this.setState({ board });
  }

  //reveal neighbouring cells if cell value is 0
  revealEmpty(x, y) {
    let neighbouringCells = [];
    for (let i = x - 1; i < x + 2; i++) {
      for (let j = y - 1; j < y + 2; j++) {

        //check whether coordinates are valid
        if (this.state.boardSize > i && i > -1 &&
          this.state.boardSize > j && j > -1 && !this.state.board[i][j].isRevealed) {
          this.revealCell(i, j);
          neighbouringCells.push(this.state.board[i][j]);
        } else { continue }
      }
    }

    //reveal cells untill neighbour cell value is not 0
    neighbouringCells.map(cell => {
      if (cell.value === 0) { this.revealEmpty(cell.x, cell.y) }
    })
  }

  //check whether the number of hidden cells equals the number of mines, i.e. game won
  gameWon() {
    const cellHidden = [];
    Object.values(this.state.board).map(row => row.map((cell) => {
      if (!cell.isRevealed) {
        cellHidden.push(cell);
      }
    }
    ));

    if (cellHidden.length === this.state.mines) {
      this.setState({ gameStatus: "(You won!)" });
      alert("Congratulations! You won!");
    }
  }

  componentDidMount() {
    this.placeMines();
  }

  render() {
    return (
      <Layout title={`Minesweeper ${this.state.gameStatus}`} mineCount={`Mines left: ${this.state.mineCount}`}>
        <div>
          <label htmlFor="boardSize" style={{ padding: '10px' }}>Board Size:  </label>
          <input
            type="number"
            name="boardSize"
            value={this.state.newSize || 10}
            style={{ padding: '10px', width: '60px' }}
            onChange={(event) => this.setState({ newSize: parseFloat(event.target.value) })} />
          <label htmlFor="mines" style={{ padding: '10px' }}> Mines:  </label>
          <input
            type="number"
            name="mines"
            value={this.state.mines || 10}
            style={{ padding: '10px', width: '60px' }}
            onChange={(event) => this.setState({ mines: parseFloat(event.target.value) })} />
        </div>
        <Button onClick={() => this.setState({ boardSize: this.state.newSize }, () => this.placeMines())}>New Game</Button>
        <Desk boardSize={this.state.boardSize}>
          {this.state.boardSize === this.state.newSize ? this.createBoard(this.state.boardSize) : ''}
        </Desk>
      </Layout >
    )
  }
}