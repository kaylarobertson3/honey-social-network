import React, { Component } from 'react';
import axios from 'axios';
import { Link, browserHistory } from 'react-router';

export default class AddFriendButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        // these are the 3 actions you can do
        this.sendFriendRequest = this.sendFriendRequest.bind(this);
        this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
        this.terminateFriendship = this.terminateFriendship.bind(this);
    }

    sendFriendRequest() {
        // changes status to 0
        axios.post('/sendFriendRequest/' + this.props.userid).then((resp) => {

            console.log(resp);
            if (resp.data.success) {
            //     if sender is the other person
            //     if (resp.data.sender == this.props.userid) {
            //         console.log("sender is the other person");
            //         this.setState({
            //             acceptFriendRequest: true,
            //             declineFriendRequest: true
            //         })
            //     }
            // if (resp.data.recipient === userid)
            //     else if (resp.data.recipient == this.props.userid ){
                    console.log("sender is me");
                    this.setState({
                        cancelFriendRequest: true,
                        pendingFriendRequest: true,
                        noStatus: false
                    })
                // }
            }
        })
    }


    acceptFriendRequest() {
        // changes status to 1
        axios.post('/acceptFriendRequest/' + this.props.userid).then((resp) => {
            if (resp.data.success) {
                // once accepted, show terminate buttons. hide everything else.
                this.setState({
                    pendingFriendRequest: false,
                    acceptFriendRequest: false,
                    cancelFriendRequest: false,
                    declineFriendRequest: false,
                    endFriendship: true,
                    areFriends: true
                })
            }
        })
    }

    terminateFriendship() {
        // deletes row
        axios.post('/terminateFriendship/' + this.props.userid).then((resp) => {
            if (resp.data.success) {
                // once cancelled, show o no status (only can add again), hide other buttons.
                this.setState({
                    acceptFriendRequest: false,
                    cancelFriendRequest: false,
                    pendingFriendRequest: false,
                    acceptFriendRequest: false,
                    endFriendship: false,
                    areFriends: false,
                    declineFriendRequest: false,
                    noStatus: true
                })
            }
        })
    }


    // After checking friend status, show buttons depending on what status came back.
    componentDidMount() {
        var {userid} = this.props;
        axios.get('/getFriendshipStatus/' + this.props.userid).then((resp) => {

            console.log("FRIEND BUTTON. RECIPIENT: ", resp.data.recipient, "SENDER: ", resp.data.sender, "OTHER USER: ", this.props.userid);

            // 0 = pending.
            if (resp.data.status === 0) {
                console.log("pending status (0):", resp.data);
                console.log(resp.data.sender, this.props.userid);

                // if sender is the other person
                if (resp.data.sender == this.props.userid) {
                    console.log("sender is the other person");
                    this.setState({
                        acceptFriendRequest: true,
                        declineFriendRequest: true
                    })
                }
                // if (resp.data.recipient === userid)
                else if (resp.data.recipient == this.props.userid ){
                    console.log("sender is me");
                    this.setState({
                        cancelFriendRequest: true,
                        pendingFriendRequest: true,
                    })
                }
            }

            // 1 = friends
             else if (resp.data.status === 1) {
                console.log("friends status (1):", resp.data);
                // both users can end friendship
                this.setState({

                    endFriendship: true,
                    areFriends: true
                })
            }

            // 2 = NOT friends.
             else {
                console.log("not friends status (2 or nothing):", resp.data.status);
                this.setState({
                    noStatus: true,
                })
            }
            console.log("Rendering button with this state: ", this.state);
        })
    }


    render() {

        const { noStatus, pendingFriendRequest, acceptFriendRequest, cancelFriendRequest, declineFriendRequest, endFriendship, areFriends } = this.state;

            return (
            <div>
                { noStatus && <button className="addFriendButton" onClick={this.sendFriendRequest}>Send Friend Request</button> }
                { acceptFriendRequest && <button className="addFriendButton" onClick={this.acceptFriendRequest}>Accept Friend Request</button> }
                { cancelFriendRequest && <button className="addFriendButton" onClick={this.terminateFriendship}>Take back Friend Request</button> }
                { declineFriendRequest && <button className="addFriendButton" onClick={this.terminateFriendship}>Decline Friend Request</button> }
                { pendingFriendRequest && <p>Friend request is pending</p> }
                { endFriendship && <button className="addFriendButton" onClick={this.terminateFriendship}>End Friendship</button> }
                {/* { areFriends && <h2>You are now friends!</h2>} */}
            </div>
        )
    }
}
