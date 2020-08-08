const bcryptjs = require('bcryptjs');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const secrets = require('../config/secret.js');

const Users = require('../users/users-model.js');
const { isValid } = require('../users/users-service.js');

router.post('/register', (req, res) => {
    const credentials = req.body;

    if (isValid(credentials)) {
        const rounds = process.env.BCRYPT_ROUNDS || 8;
        const hash = bcryptjs.hashSync(credentials.password, rounds);
        credentials.password = hash;

        Users.add(credentials)
            .then(user => {
                const token = genToken(saved);
                res.status(201).json({
                    data: user, token
                });
            })
            .catch(err => {
                res.status(500).json({
                    message: err.message
                });
            });
    } else {
        res.status(400).json({
            message: 'Please provide credentials'
        });
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (isValid(req.body)) {
        Users.findBy({username: username})
            .then(([user]) => {
                if (user && bcryptjs.compareSync(password, user.password)) {
                    const token = generateToken(user);
                    res.status(200).json({
                        message: 'Why hello there, welcome!',
                        token
                    });
                } else {
                    res.status(401).json({
                        message: 'Wrong credentials buddy'
                    });
                }
            }) 
            .catch(err => {
                res.status(500).json({
                    message: err.message
                });
            });
    } else {
        res.status(400).json({
            message: 'Provide your credentials yo!'
        });
    };
});

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username
    };
    const options = {
        expiresIn: '2h'
    };
    return jwt.sign(payload, secrets.jwtSecret, options)
};

module.exports = router;