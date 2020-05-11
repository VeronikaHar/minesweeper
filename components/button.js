import { createComponent } from 'cf-style-container';

const Button = createComponent(
    ({ hover }) => ({
        width: 150,
        padding: 10,
        margin: '15px auto',
        cursor: 'pointer',
        backgroundColor: '#4F707A',
        color: '#fff',
        border: `1px solid white`,
        borderRadius: `5px`,
        lineHeight: 1,
        textAlign: 'center',
        fontSize: 18
    }),
    'button',
    ['onClick']
);

export default Button;