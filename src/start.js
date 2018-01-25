

// React requirments
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory, browserHistory} from 'react-router';
import { Link } from 'react-router';

// Redux and Redux Devtools
import {createStore, applyMiddleware} from 'redux';
import reduxPromise from 'redux-promise';
import reducer from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';

// Two main pages you can go to:
import Welcome from './welcome';
import App from './app';

// These components swap in and out when path is /WELCOME
import Register from './register';
import Login from './login';

// These components swap in and out when path is /APP
import Profile from './profile';
import OtherProfile from './otherProfile';
import Friends from './friends';

import ProfilePic from './profilePic';

import * as io from 'socket.io-client';
import Online from './online';




export const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));

const loggedInRouter = (<Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <Route path="/user/:userid" component={OtherProfile}/>
                <Route path="/friends" component={Friends}/>
                <Route path="/online" component={Online}/>
                <IndexRoute component={Profile} />
                <redirect from="*" to="/"/>
            </Route>
        </Router>
    </Provider>);


const notLoggedInRouter = (<Provider store={store}>
    <Router history={hashHistory}>
        <Route path="/" component={Welcome}>
            <Route path="/login" component={Login}/>
            <IndexRoute component={Register}/>
        </Route>
    </Router>
</Provider>);


// this dictates which router we will use based on the url. In server, set cookies or something to dictace which url shows up.

let router;
if (location.pathname === '/welcome/') {
    router = notLoggedInRouter
} else {
    router = loggedInRouter
}

ReactDOM.render(router, document.querySelector('#main'));
