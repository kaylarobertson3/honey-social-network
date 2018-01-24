import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import ProfilePic from './profilePic';
import UpdateProfilePic from './updateProfilePic';
import UpdateBio from './updateBio';
import Friends from './friends';


export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        uploaderIsVisible: false;
    }

    render() {
        console.log(this.state);
        if(!this.state) {
            console.log("loading");
            return (
                <div>
                    <Loading/>
                </div>
            )
            } else {
                        console.log("rendering profile with these props: ", this.props);
            return (
                <div className="animated fadeIn">
                    <div className="coverWrapper">
                        <img className="cover" src="/./public/honey.jpg"/>
                    </div>
                    <div className="profilePic">
                        <ProfilePic imgUrl={this.props.imgUrl} showUploader={() => this.setState({
                        uploaderIsVisible: !this.state.uploaderIsVisible
                        })}/>
                    </div>
                {this.state.uploaderIsVisible && <UpdateProfilePic setImage={this.props.setImage}/>}
                <div className="profile">
                    <h1>{this.props.first} {this.props.last}</h1>
                    <p className="bio">{this.props.bio}</p>
                    <button onClick={this.props.showBioEditor}>Edit bio</button>
                </div>
                {this.props.bioEditorIsVisible && <UpdateBio setBio={this.props.setBio}/>}
                <Friends/>
        </div>
        )
    }
}

}
