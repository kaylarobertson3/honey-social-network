import axios from 'axios';

// get friends
export function getFriends() {
    return axios.get('/getFriends').then(function({data}) {
        return {
            type: 'GET_FRIENDS',
            friends: data.friendsData
        };
    });
}

// end friendship
export function endFriendship(id) {
    const data = {
        action: "endFriendship",
        id: id
    };
    return axios.post("/terminateFriendship/" + id, data).then(() => {
        return {
            type: 'END_FRIENDSHIP',
            id: id
        };
    });
}


// accept friendship
export function acceptFriendRequest(id) {
    const data = {
        action: 'acceptFriendRequest',
        id: id
    };
    return axios.post('/acceptFriend/' + id, data).then(() => {
        return {
            type: 'ACCEPT_REQUEST',
            id: id
        };
    });
}

/////// SOCKETS ////////

export function allOnlineUsers(id) {
    const data = {
        action: 'getOnlineUsers',
        id: id
    };
    return axios.get('/getOnlineUsers/' + id, data).then((data) => {
        return {
            type: 'GET_ONLINE_USERS'
            // online:
        };
    });
}
