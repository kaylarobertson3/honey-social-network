import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router';


export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
}

handleChange(e) {
    this.setState({
        [e.target.name]: e.target.value // this is NOT AN ARRAY
    }, () => {
    });
}

handleClick(e) {
    e.preventDefault();
    const { email, password } = this.state
    const data = { email, password}

    if (!email || !password) {
        this.setState({error: true, message: "Fields can't be empty"})
    } else {
        axios.post('/login', data).then(resp => {
            if (resp.data.success) {
                location.replace('/');
            } else {
                this.setState({error: true, message: "Wrong email or password"})
            }
        })
    }
}


render() {
    return (
        <div className="form animated fadeIn">
            <h1 className="login">Login</h1>
            <Link to="/"><p className="orRegister">Or Register</p></Link>
            <div className="form">
                {this.state.error && <div className="error"><p>{this.state.message}</p></div>}
                <input name="email" onChange={this.handleChange} type="email" placeholder="email"/>
                <input name="password" onChange={this.handleChange} type="password" placeholder="password"/>
            </div>
            <button onClick={this.handleClick}>Submit</button>
        </div>
    )
}
}
