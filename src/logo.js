import React from 'react';
import { Link } from 'react-router';

export default function Logo() {
    return (
        <Link to="/"><img className="logoImg" src="/blackLogo.png"/></Link>
    )
}
