const jwt = require('jsonwebtoken');
const secret = process.env.SAUCE || "notAteenAnymore@2005";

function createTokenForUser(user) {

    const payload = {
        _id: user._id,
        email: user.email,
    };

    const token = jwt.sign(payload, secret);
    return token;
}

function validateToken(token) {
    const payload = jwt.verify(token, secret);
    return payload;
}

module.exports = {createTokenForUser, validateToken};