import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import ProfilePic from './profilePic';
import UpdateProfilePic from './updateProfilePic';
import UpdateBio from './updateBio';
import { browserHistory } from 'react-router';
import AddFriendButton from './addFriendButton';
import Loading from './loading';



export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        var id = this.props.params.userid;
        axios.get('/otherProfile/' + id)
            .then((data) => {
                if (data.data.success === true) {
                    this.setState({
                        imgUrl: data.data.imgUrl,
                        first: data.data.first,
                        last: data.data.last,
                        email: data.data.email,
                        id: data.data.id,
                        bio: data.data.bio
                    })
                } else {
                    console.log("error in axios.get.otherProfile");
                    browserHistory.push('/');
                }
            });
        }

    render() {
        if (!this.state.first) {
            return (
            <div>
                <Loading/>
            </div>
        )

        } else {
            return (
                <div className="animated fadeIn">
                    <div className="coverWrapper">
                        <img className="cover" src="honey.jpg"/>
                    </div>
                    {this.state.error && <div className="error"><p>{this.state.message}</p></div>}
                    <div className="profilePic">
                        <ProfilePic imgUrl={this.state.imgUrl} alt={this.state.first}/>
                    </div>

                    <div className="profile">
                        <h1>{this.state.first} {this.state.last}</h1>
                        <p class="bio">{this.state.bio}</p>
                        <AddFriendButton className="button" userid = {this.props.params.userid} />
                    </div>
                </div>
            )
        }
    }
}
