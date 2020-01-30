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
    flagIndeces: [],
    bombClicked: false
  }

  //function that handles right click
  handleRightClick(i) {
    if (this.state.mineIndeces.includes(i)) {
      this.setState({ bombClicked: true })
    }
  }

  //create a deskboard of assigned size
  createBoard() {
    let squareArr = [];
    for (let i = 0; i < (this.state.boardSize * this.state.boardSize); i++) {
      squareArr.push(
        <Square
          key={i}
          disabled={this.state.bombClicked ? i + 1 : ""}
          onClick={() => this.handleRightClick(i)}
          onContextMenu={(e) => {
            //prevent left click default menu from opening
            e.preventDefault(),
              this.handleLeftClick(i)
          }}
        > {this.state.mineIndeces.includes(i) && this.state.bombClicked ? <Mine /> : ""}
          {this.state.flagIndeces.includes(i) && !this.state.bombClicked ? <Flag /> : ""}
        </Square>)
    }
    return squareArr;
  }

  //function that handles left click
  handleLeftClick(i) {
    const index = this.state.flagIndeces.indexOf(i);
    if (index > -1) {
      this.state.flagIndeces.splice(index, 1);
      this.setState({ flagIndeces: this.state.flagIndeces });
    } else {
      this.setState({ flagIndeces: [...this.state.flagIndeces, i] })
    }
  }

  //assign random indeces from the board to mines
  placeMine = () => {
    let mineIndeces = [];
    for (let i = 0; mineIndeces.length < this.state.mines; i++) {
      let index = Math.floor(Math.random() * this.state.boardSize * this.state.boardSize);
      if (mineIndeces.indexOf(index) === -1) {
        mineIndeces.push(index);
      }
    }
    mineIndeces.sort((a, b) => a - b);
    this.setState({ mineIndeces });
  }

  componentDidMount() {
    this.placeMine()
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