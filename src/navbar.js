import React, { Component } from 'react';
import axios from 'axios';
import ProfilePic from './profilePic';
import Logo from './logo';
import UpdateProfilePic from './updateProfilePic';
import { Link } from 'react-router';


export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false
        };
    }

    render() {
        return (
        <div>
            <div className="navbar">
                <div className="navbarWrapper">
                    <div className="navBarLeft">
                        <div className="logoNav">
                                <Link to="/"><Logo /></Link>
                        </div>
                    </div>
                    <div className="navBarRight">
                        <Link to="/" className="navBarName"><h2>Hi, {this.props.first}!</h2></Link>
                        <Link to="/friends"><h2>Friends</h2></Link>
                        <Link to="/online"><h2>Online Users</h2></Link>
                        <a href="/logout"><h2>Logout</h2></a>
                        <div className="profileIcon">
                                <ProfilePic imgUrl={this.props.imgUrl} showUploader={() => this.setState({
                                uploaderIsVisible: !this.state.uploaderIsVisible
                            })}/>
                        </div>
                    </div>
                    {/* <div className="hr-line"></div> */}
                </div>
            </div>
            {this.state.uploaderIsVisible && <UpdateProfilePic setImage={this.props.setImage}/>}
        </div>
        )
    }
}
