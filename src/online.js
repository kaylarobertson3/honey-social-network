import React, { Component } from 'react';
import { connect } from 'react-redux';
import { allOnlineUsers } from './actions';
import Loading from './loading';

export class Online extends Component {
    componentDidMount() {
        this.props.allOnlineUsers()
    };

    render() {
        const { allOnlineUsers, online } = this.props;

        if(!online) {
            console.log("loading");
            return (
                <div>
                    <Loading/>
                </div>
            )
            } else {
            return (
                <div>
                    <h2>Online Users</h2>
                    {
                        online.map((online,index) => <div key={index}>
                            <img src={online.imgurl}/>
                            <p>{online.first} {online.last}</p>
                        </div>)
                    }
                </div>
            )
    }
}
}

const mapStateToProps = (state) => {
    return { online: state.online }
};

const mapDispatchToProps = (dispatch) => {
    return {
        allOnlineUsers: () => dispatch(allOnlineUsers())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Online);
