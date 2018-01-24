import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { getFriends, endFriendship, acceptFriendRequest } from './actions';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class Friends extends Component {
    componentDidMount() {
        this.props.getFriends();
    };

    render(){
        if (!this.props.friends) {
            return (
                <div className="content">
                    loading . . .
                </div>
            )
        }

        const {friends, friendRequests, getFriends, endFriendship, acceptFriendRequest} = this.props


        return (
            <div className="allFriends animated fadeIn">
                <h2>Friends</h2>
                <div className="friends">
                    { friends.map((friends, index) =>
                    <div className="friend" key={index}>
                        <Link to={`/user/${friends.id}`}>
                            <img src={friends.imgurl}/>
                            <p>{friends.first} {friends.last}</p>
                        </Link>
                        <button onClick={() => {
                            this.props.endFriendship(friends.id)
                        }}>
                        End friendship
                        </button>
                    </div>
                )}
                </div>
                <br/>
                <br/>
                <br/>

                <h2>Friend Requests</h2>
                <div className="friendRequests">
                    { friendRequests.map((friendRequests, index) =>
                        <div className="friendRequest" key={index}>
                            <Link to={`/user/${friendRequests.id}`}>
                                <img src={friendRequests.imgurl}/>
                                <p>{friendRequests.first} {friendRequests.last}</p>
                            </Link>
                            <button onClick={() => {
                                this.props.acceptFriendRequest(friendRequests.id)
                                }}>
                            Accept Friend Request
                            </button>
                        </div>

                    )}
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    console.log(state.friends);
    return {
        friends: state.friends && state.friends.filter(friends => friends.status == '1'),
        friendRequests: state.friends && state.friends.filter(friends => friends.status == '0')
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        getFriends: () => dispatch(getFriends()),
        endFriendship: (id) => dispatch(endFriendship(id)),
        acceptFriendRequest: (id) => dispatch(acceptFriendRequest(id))

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Friends);
