import React from 'react'
import { Link } from 'react-router-dom'
import { create, props } from '@stylexjs/stylex'

const nav = create({
    base: {
        textAlign: 'center',
        color: 'red',
        fontSize: '22px'
    },
    highlighted: {
        color: 'rebeccapurple',
    },
});

const Navbar = () => {

    return (
        <div {...props(nav.base, nav.highlighted)}>
            Navbar
        </div>
    )
}

export default Navbar