import React, { Component } from 'react'
import { Link } from 'react-router';
import Loading from './loading'

export default class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {loaded: false}; // setting up defualt state
        }

        componentDidMount() {
            this.setState({loaded: true});
        }

        // if there is no state, use loading component.
        render() {
            if(this.state.loaded == false) {
                console.log("loading");
                return (
                    <div>
                        <Loading/>
                    </div>
                )
            } else {
            return (
                <div>
                    <div className="welcome animated fadeIn">
                        <div className="welcomeFlex">
                            <img className="logo" src="/logo2.png"/>
                            <h1 className="welcomeH12">Creating buzz between beekeepers</h1>
                            <div className="welcomeContainer">
                            {this.props.children}
                            </div>
                        </div>
                </div>
            </div>
            )
        }
    }
}
