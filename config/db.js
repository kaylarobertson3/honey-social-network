var spicedPg = require('spiced-pg');
const bcrypt = require('bcryptjs');
var db;
const S3config = require('./S3config.json');

//this is for heroku right?
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg(`postgres:postgres:postgres@localhost:5432/social`);
}

// Register
exports.register = function(first, last, email, password) {
    const params = [first, last, email, password];
    const q = `INSERT INTO USERS (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id`;
    return db.query(q, params).then(function(results) {
        console.log("db reg results", results.rows);
        return results.rows[0].id;
    }).catch((err) => {
        console.log("error in sending registration data to db", err);
        // How do i get this error to
    });
};

// Hash password
exports.hashPassword = function(plainTextPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt((err, salt) => {
            if (err) {
                console.log("error in bcrypt.genSalt", err);
            }
            bcrypt.hash(plainTextPassword, salt, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
};

// check password on login
exports.checkPassword = function(plainTextPassword, storedHash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainTextPassword, storedHash, (err, match) => {
            if (err) {
                reject(err);
            } else {
                resolve(match);
            }
        });
    });
};


// match password up with user info for loggedInRouter
exports.getUserInfo = function(email) {
    console.log("running getUserInfo with this email: ", email);
    return db.query(`SELECT id, first, last, email, password, bio
     FROM users
     WHERE email = $1`,[email]).then((results) => {
        console.log("results from getUserInfo: ", results.rows);
        return results.rows[0];
    }).catch(function(err) {
        console.log("error in getUserInfo", err);
        throw err;
    });
};


// check friendship status
// OR (sender_id = $2 AND recipient_id = $1)
exports.getFriendshipStatus = function(id, userid) {
    const params = [id, userid];
    const q = (`SELECT *
                    FROM friend_status
                    WHERE (sender_id = $1 AND recipient_id = $2) OR (recipient_id = $1 AND sender_id = $2)
                    `);
    return db.query(q, params).then((results) => {
        console.log("results from db.getFriendshipStatus", results.rows[0]);
        return results.rows[0];
    }).catch((err) => {
        console.log("error in db.getFriendShipStatus", err);
    });
};


// UPDATE FRIENDSHIP STATUS:

// accept friend request
exports.acceptFriendRequest = function(sender_id, recipient_id) {
    const params = [1, sender_id, recipient_id];
    const q = (`UPDATE friend_status
                SET status = $1
                WHERE (sender_id = $2 AND recipient_id = $3) OR (recipient_id = $2 AND sender_id = $3)`);
    return db.query(q, params).then(() => {
        console.log("db.acceptFriendRequest happened");
    }).catch((err) => {
        console.log('error in db acceptFriendRequest', err);
    });
};

// send friend request.. update or insert?
exports.sendFriendRequest = function(sender_id, recipient_id) {
    const params = [0, sender_id, recipient_id];
    const q = (`INSERT INTO friend_status (status, sender_id, recipient_id) VALUES ($1, $2, $3) RETURNING sender_id`);
    return db.query(q, params).then((results) => {
        console.log("db.sendFriendRequest happened. returning sender id:", results);
        return results;
    }).catch((err) => {
        console.log('error in db sendFriendRequest', err);
    });
};

// terminate friendship / friend Request
exports.terminateFriendship = function(sender_id, recipient_id) {
    const params = [sender_id, recipient_id];
    const q = (`DELETE FROM friend_status
                WHERE (sender_id = $1 AND recipient_id = $2) OR (recipient_id = $1 AND sender_id = $2)`);
    return db.query(q, params).then(() => {
        console.log("db.terminateFriendship happened");
    }).catch((err) => {
        console.log('error in db terminateFriendship', err);
    });
};


// Get profile info
exports.getProfileInfo = function(id) {
    console.log("id:", id);
    const q = `SELECT * FROM users WHERE id = $1`;
    const params = [ id ];
    return db.query(q, params)
        .then(results => {
            console.log("results from db.getProfileInfo: ", results.rows[0]);
            return results.rows[0];
        });
};


// send photo to database
exports.updateProfilePic = function(img, id) {
    // const imgUrl = S3config.s3Url + img;
    const params = [img, id];
    const q = 'UPDATE users SET imgUrl = $1 WHERE id = $2 RETURNING imgUrl';
    return db.query(q,params)
        .then((results) => {
            console.log("results from db updateprofilepic: ", results.rows[0]);
            return results.rows[0];
        }).catch((err) => {
            console.log("err in updateProfilePic", err);
        });
};

//Update / set bio
exports.updateBio = function(bio, id) {
    const params = [bio, id];
    const q = `
        UPDATE users
        SET bio = $1
        WHERE id = $2
        RETURNING bio`;
    return db.query(q,params)
        .then((results) => {
            console.log("results from updateBio db", results.rows[0]);
            return results.rows[0];
        }).catch((err) => {
            console.log("error in updateBio db", err);
        });
};


// get friends. id is logged in user
    // OR (status = 0 AND recipient_id = users.id AND sender_id = $1)
exports.getFriends = function(id) {
    const params = [id];
    const q = `SELECT users.id, users.first, users.last, users.imgurl, friend_status.status
    FROM users
    INNER JOIN friend_status
    ON (status = 0 AND recipient_id = $1 AND sender_id = users.id)

    OR (status = 1 AND recipient_id = $1 AND sender_id = users.id)
    OR (status = 1 AND sender_id = $1 AND recipient_id = users.id)`;
    return db.query(q, params).then((results) => {
        console.log("results from db.getFriends", results.rows);
        return results.rows;
    });
};
