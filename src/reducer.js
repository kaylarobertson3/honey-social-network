
// REDUCERS

export default function(state = { friends: [] }, action) {

    // GET EXISTING FRIENDS
    if (action.type == 'GET_FRIENDS') {
        state = Object.assign({}, state, {
            friends: action.friends
        });
    }

    if (action.type == 'END_FRIENDSHIP') {
        state = Object.assign({}, state, {
            friends: state.friends.map(friends => {
                if (friends.id == action.id) {
                    return Object.assign({}, friends, {
                        status: 3
                    });
                } else {
                    return friends;
                }
            })
        });
    }

    // ACCEPT FRIEND REQUEST
    if (action.type == "ACCEPT_REQUEST") {
        state = Object.assign({}, state, {
            friends: state.friends.map(friends => {
                if(friends.id == action.id) {
                    return Object.assign({}, friends, {
                        status: 1
                    });
                } else {
                    return friends;
                }
            })
        });
    }

    // GET ONLINE USERS
    if (action.type == "GET_ONLINE_USERS") {
        state = Object.assign({}, state, {
            online: action.online
        });
    }




    return state;
}
