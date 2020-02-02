import { createComponent } from 'cf-style-container';

const Square = createComponent(
  ({ disabled }) => ({
    width: 40,
    height: 40,
    padding: 10,
    cursor: disabled ? 'initial' : 'pointer',
    backgroundColor: disabled ? '#D4EAFF' : '#B0957F',
    border: `1px solid white`,
    borderRadius: `5px`,
    lineHeight: 1,
    textAlign: 'center',
    fontSize: 18
  }),
  'div',
  ['onClick', 'onContextMenu']
);

export default Square;
