
// SETUP =================================================================================================================

// express
const express = require('express');
const app = express();

// socket.io
const server = require('http').Server(app);
const io = require('socket.io')(server);

// compression
const compression = require('compression');
app.use(compression());

// body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// s3
const s3 = require('./config/s3.js');

// config
const S3config = require("./config/S3config.json");

// cookies
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
app.use(cookieParser());
app.use(cookieSession({
    secret: 'Top-secret secret',
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

// db
const db = require('./config/db.js');

// image upload requirments
var multer = require('multer');
var uidSafe = require('uid-safe');
const path = require('path');



// if app is in production (heroku), use this
if (process.env.NODE_ENV != 'production') {
    app.use('/bundle.js', require('http-proxy-middleware')({target: 'http://localhost:8081/'}));
}

// MULTER MIDDLEWARE SETTINGS
var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152 // file limit size prevents DOS attacks
    }
});

// Static
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static('./uploads')); // is this needed????






// GET ROUTES ========================================================================================================================================================================

// root ====================================================================================
// app.get('/', (req, res) => { // this is the route for being logged in
//     if (!req.session.user) { // only get to slash if there;s a user
//         res.redirect('/welcome');
//     } else {
//         res.sendFile(__dirname + '/index.html');
//     }
// });



// Welcome ====================================================================================
app.get('/welcome', (req, res) => { // not logged in route
    if (req.session.user) { // only see /welcome if you're not a user
        res.redirect('/'); // redirect to app, because the router would be notLoggedIn
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});


// user ====================================================================================
app.get('/user', (req, res) => {
    db.getProfileInfo(req.session.user.id).then(data => {
        res.json({
            first: data.first,
            last: data.last,
            email: data.email,
            imgUrl: data.imgurl ? S3config.s3Url + data.imgurl : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
            bio: data.bio
        });
    });
});


// Get friendship status ================================================================================
app.get('/getFriendshipStatus/:userid', (req, res) => {
    db.getFriendshipStatus(req.session.user.id, req.params.userid).then((data) => {
        res.json({
            status: data.status,
            sender: data.sender_id,
            recipient: data.recipient_id
        });
    }).catch((err) => {
        res.json({empty: true});
        console.log("error in index.js getFriendshipStatus get", err);
    });
});

// Other user ================================================================================
app.get('/otherProfile/:userid', (req, res) => {
    if (req.params.userid == req.session.user.id) {
        res.json({success: false});
    } else {
        db.getProfileInfo(req.params.userid)
            .then(data => {
                res.json({
                    success: true,
                    first: data.first,
                    last: data.last,
                    imgUrl: data.imgurl ? S3config.s3Url + data.imgurl : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
                    bio: data.bio,
                    id: data.id,
                    email: data.email
                });
            }).catch(err => {
                res.json({success: false});
                console.log("error in index.js otherProfile get", err);
            });
    }
});


// logout ====================================================================================
app.get('/logout', (req, res) => {
    // req.session.destroy();
    req.session = null;
    res.redirect('/welcome');
});


// POST ROUTES ============================================================================================================================================================================


// register ========================================================================================================================================================================
app.post('/register', (req, res) => {

    db.hashPassword(req.body.password).then((password) => {
        db.register(req.body.first, req.body.last, req.body.email, password).then((id) => {
            // set cookies on register
            req.session.user = {
                id: id,
                first: req.body.first,
                last: req.body.last,
                email: req.body.email
            };
            res.json({success: true});
            // res.redirect('/') // where do we redirect?
        });
    }).catch((err) => {
        req.session = null;
        console.log("error in post /register", err, "cookies are: ", req.session);
        res.json({success: false});
    });
});


// update profile picture ========================================================================================================================================================================
app.post('/updateProfilePic', uploader.single('file'), (req, res) => {
    if (req.file) {
        s3.uploadToS3(req.file)
            .then(() => {
                return db.updateProfilePic(req.file.filename, req.session.user.id);
            }).then((image) => {
                res.json({
                    success: true,
                    imgUrl: S3config.s3Url + req.file.filename
                });
            }).catch((err) => {
                console.log("error in catch of index.js updateprofile pic ", err);
            });
    } else {
        res.json({success: false});
        console.log("there was no good file");
    }
});


// UPDATE BIO ========================================================================================================================================================================
app.post('/updateBio', (req, res) => {
    db.updateBio(req.body.bio, req.session.user.id)
        .then(results => {
            res.json({
                success: true,
                bio: req.body.bio
            });
        });
});



// login ============================================================================================================================================
app.post('/login', (req, res) => {
    if (!req.body.email || !req.body.password) {
        // error: true;
        res.json('Error: Empty input');
        console.log("Error: Empty input");
    } else {
        //compare against email to  check get password
        db.getUserInfo(req.body.email).then((results) => {
            return db.checkPassword(req.body.password, results.password).then((match) => {
                if (match) {
                    //set cookies on login
                    req.session.user = {
                        id: results.id,
                        first: results.first,
                        last: results.last,
                        email: results.email,
                        bio: results.bio
                    };
                    // res.redirect('/'); // is this the right redirect?
                    res.json({success: true});
                } else {
                    res.json({errorMessage: 'email/password not a match'});
                }
            });

        }).catch((err) => {
            res.json('email/password not a match');
            console.log("error in post /register", err, "cookies are: ", req.session);
        });
    }
});


// ACCEPT FRIEND REQUEST
app.post('/acceptFriendRequest/:userid', (req, res) => {
    db.acceptFriendRequest(req.session.user.id, req.params.userid).then((data) => {
        res.json({
            success: true, data});
    }).catch((err) => {
        console.log("error in acceptFriendRequest", err);
    });
});


// TERMINATE FRIENDSHIP / FRIEND REQUEST (CANCEL)
app.post('/terminateFriendship/:userid', (req, res) => {
    db.terminateFriendship(req.session.user.id, req.params.userid).then((data) => {
        res.json({success: true, data});
    }).catch((err) => {
        console.log("error in terminateFriendship", err);
    });
});


// SEND FRIEND REQUEST
app.post('/sendFriendRequest/:userid', (req, res) => {
    db.sendFriendRequest(req.session.user.id, req.params.userid).then((data) => {
        res.json({
            success: true,
            sender: data.rows[0].sender_id,
        });
    }).catch((err) => {
        console.log("error in sendFriendRequest", err);
    });
});

// FRIENDS PAGE
app.get("/getFriends", (req, res) => {
    db.getFriends(req.session.user.id)
        .then((friendsData) => {
            friendsData.forEach((friendsData) => {
                if (!friendsData.imgurl) {
                    friendsData.imgurl= "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
                } else {
                    friendsData.imgurl = S3config.s3Url + friendsData.imgurl;
                }
            });
            res.json({
                friendsData
            });
        })
        .catch((err) => {
            console.log("error in index get /friends", err);
        });
});


// FRIENDS PAGE END FRIENDSHIP
app.post('/endFriend/:id', (req, res) => {
    db.terminateFriendship(req.session.user.id, req.params.userid).then((data) => {
        res.json({success: true, data});
    }).catch((err) => {
        console.log("error in terminateFriendship", err);
    });
});


// FRIENDS PAGE ACCEPT FRIENDREQUEST
app.post('/acceptFriend/:id', (req, res) => {
    db.acceptFriendRequest(req.session.user.id, req.params.id).then((data) => {
        res.json({
            success: true, data
        });
    }).catch((err) => {
        console.log("error in acceptFriendRequest", err);
    });
});

// // GET ONLINE USERS ~~~~ socket.io time
var onlineUsers = [];
app.get('/getOnlineUsers/:socketId', (req, res) => {

    if (!req.session.user) {
        return res.sendStatus(500);
    }
    const socketId = req.params.socketId;
    const id = req.session.user.id;

    var onlineIds = onlineUsers.map(
        user => user.userId
    );

    if (onlineIds.length == 0) {
    }

    db.getOnlineUsersById(onlineIds).then(data => {
        io.sockets.sockets[socketId].emit('people online ugh', data);
    });
});



// SPA ROUTING ========================================================================================================================================================================

app.get('*', function(req, res) {
    if (!req.session.user) {
        res.redirect('/welcome');

    } else if (req.session.user) {
        res.sendFile(__dirname + '/index.html');
    }
});



// RUN SERVER ============================================================================================================================================
var port = process.env.OORT || 8080;


app.listen(port, function() {
    console.log("app is running on port " + port);
});
