const {model, Schema} = require('mongoose');
const {createHmac, randomBytes} = require('node:crypto')
const {createTokenForUser} = require('../services/auth')

const userSchema = new Schema({

    fullname: {type: String, required: true},
    username: {type: String},
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'], 
    },
    profilepic: {type: String},
    about: {type: String},
    salt: { type: String },
    password: {type: String, required: true},
}, {timestamps: true})


userSchema.pre("save", function (next) {
    const user = this;

    if(!user.isModified("password")) return;             // if no change is done

    const salt = randomBytes(16).toString('hex');             // random string
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest("hex");

    // Log the salt and hashed password to check correctness
    // console.log('Generated Salt:', salt);
    // console.log('Hashed Password:', hashedPassword);

    this.salt = salt;
    this.password = hashedPassword;

    next();
});


userSchema.static('matchPasswordAndGenerateToken', async function(email, password) {
    const user = await this.findOne({email});

    if(!user) throw new Error('User not found');

    // Log the values of salt and hashed password to check if they are correct
    // console.log('Salt:', user.salt);
    // console.log('Hashed Password:', user.password);

    const salt = user.salt;
    const hashedPassword = user.password;

    // Check if salt is undefined
    if (!salt) {
        throw new Error('Salt is undefined. Password hashing might have failed.');
    }

    const userProvideHash = createHmac('sha256', salt).update(password).digest("hex");

    if(hashedPassword !== userProvideHash) throw new Error('Incorrect email or password');

    const token = createTokenForUser(user);
    return token;
});

const USER = model('user', userSchema);
module.exports = USER;