import { createComponent } from 'cf-style-container';

const Desk = createComponent(({ boardSize }) => ({
  width: 40 * boardSize + 2,
  height: 40 * boardSize + 2,
  display: 'flex',
  flexWrap: 'wrap'
}));

export default Desk;
