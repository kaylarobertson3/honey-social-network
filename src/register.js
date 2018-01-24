import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router';

export default class Register extends Component {
    constructor(props) {
        super(props);
        console.log('this.props is', this.props);
        this.state = {
            first: '',
            last: '',
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
        console.log("the new state!: ", this.state);
    });
}

handleClick(e) {
    e.preventDefault();
    console.log("clicked!");
    const { first, last, email, password } = this.state
    const data = { first, last, email, password}
    console.log(data);

    if (!email || !password || !first || !last) {
        this.setState({error: true, message: "can't be empty inputs"})
    } else {
        axios.post('/register', data)
        .then(resp => {
            console.log("inside axios");
            if (resp.data.success) {
                location.replace('/');
            } else {
                this.setState({error: true, message: "Error registering."})
            }
        })
    }
}

    render() {
        return (
            <div className="animated fadeIn">
                <h1 className="login">Sign up</h1>
                <Link to="/login"><p className="orRegister">Or Login</p></Link>
                <form action="">
                    <div className="form">
                        {this.state.error && <div className="error"><p>{this.state.message}</p></div>}
                        <input name="first" onChange={this.handleChange} type="text" placeholder="first" />
                        <input name="last" onChange={this.handleChange} type="text" placeholder="last"/>
                        <input name="email" onChange={this.handleChange} type="text" placeholder="email"/>
                        <input name="password" onChange={this.handleChange} type="password" placeholder="password"/>
                    </div>
                    <button onClick={this.handleClick}>Submit</button>
                </form>
            </div>
        )
    }
}
