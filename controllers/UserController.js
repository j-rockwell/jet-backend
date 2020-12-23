const bcrypt = require('bcrypt');
const auth = require('../utils/authentication');

const User = require('../models/User');

require('dotenv').config();
const SALT_ROUNDS = process.env.SALT_ROUNDS;

module.exports = {
    /**
     * Creates a new User document from a request body
     * @param {*} req Request
     * @param {*} res Response
     */
    create: (req, res) => {
        const email = req.body.email;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const password = req.body.password;
        const token = req.body.token;

        auth.authenticate(token, (result) => {
            if ( result.status == false ) {
                res.status(401).send({
                    message: result.message
                });

                return;
            }

            if ( firstName.length < 2 || firstName.length > 32) {
                res.status(401).send({
                    message: 'First name must be 2-32 characters long'
                });
    
                return;
            }
    
            if ( !firstName.match("^[a-zA-Z0-9_]*$") ) {
                res.status(401).send({
                    message: 'First name must be characters A-Z, a-z'
                });
    
                return;
            }
    
            if ( lastName.length < 2 || lastName.length > 32) {
                res.status(401).send({
                    message: 'Last name must be 2-32 characters long'
                });
    
                return;
            }
    
            if ( !lastName.match("^[a-zA-Z0-9_]*$") ) {
                res.status(401).send({
                    message: 'Last name must be characters A-Z, a-z'
                });
    
                return;
            }
    
            if ( password.length < 8 || password.length > 32 ) {
                res.status(401).send({
                    message: 'Password must be 8-32 characters long'
                });
            }

            User.findOne({ email: email }, (err, existing) => {
                if ( err ) {
                    res.status(401).send({
                        message: 'Failed to retreive database information'
                    });
    
                    throw err;
                }
    
                if ( existing ) {
                    console.log("found user with email: " + existing.email);

                    res.status(401).send({
                        message: 'Email is already in use'
                    });
    
                    return;
                }
    
                bcrypt.hash(password, parseInt(SALT_ROUNDS), (err, hash) => {
                    if ( err ) {
                        res.status(401).send({
                            message: 'Failed to hash password'
                        });
        
                        throw err;
                    }
        
                    const user = new User({ firstName: firstName, lastName: lastName, email: email, emailConfirmed: false, password: hash });
        
                    user.save().then(() => {
                        res.status(201).send({
                            message: 'Account has been created'
                        });
        
                        console.log("Successfully created new user for " + email)
                    });
                });
            });
        });
    },

    /**
     * Processes a login from a POST request
     * @param {*} req Request
     * @param {*} res Response
     */
    login: (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        const token = req.body.token;

        auth.authenticate(token, (result) => {
            if ( result.status == false ) {
                res.status(401).send({
                    message: result.message
                });

                return;
            }

            User.findOne({ email: email }, (err, existing) => {
                if ( err ) {
                    res.status(401).send({
                        message: 'Failed to establish connection to authentication server'
                    });

                    throw err;
                }

                if ( !existing ) {
                    res.status(404).send({
                        message: 'Account not found'
                    });

                    return;
                }

                bcrypt.compare(password, existing.password, (err, same) => {
                    if ( err ) {
                        res.status(401).send({
                            message: 'Failed to authenticate account'
                        });

                        throw err;
                    }

                    if ( !same ) {
                        res.status(401).send({
                            message: 'Invalid login credentials'
                        });

                        return;
                    }

                    res.status(200).send({
                        id: existing._id,
                        firstName: existing.firstName,
                        lastName: existing.lastName,
                        email: existing.email
                    });
                });
            });
        });
    },

    /**
     * Handles updating account information for a user
     * 
     * !!! NOTE: This does not handle updating passwords, we use #updatePassword for that. !!!
     * @param {*} req 
     * @param {*} res 
     */
    updateInfo: (req, res) => {
        const id = req.body.id;
        const email = req.body.email;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const token = req.body.token;

        auth.authenticate(token, (result) => {
            if ( result.status === false ) {
                res.status(401).send({
                    message: result.message
                });

                return;
            }

            User.findById(id, (err, existing) => {
                if ( err ) {
                    res.status(401).send({
                        message: 'Failed to establish connection with authentication servers'
                    });

                    return;
                }

                if ( !existing ) {
                    res.status(404).send({
                        message: 'Account not found'
                    });

                    return;
                }

                User.findOne({ email: email }, (err, overlappingUser) => {
                    if ( err ) {
                        res.status(401).send({
                            message: 'Failed to reach authentication server'
                        });

                        return;
                    }

                    if ( overlappingUser && existing.email !== email ) {
                        res.status(409).send({
                            message: 'An account with this email already exists'
                        });

                        return;
                    }

                    // They changed their email, it needs to be confirmed again
                    if ( existing.email !== email && existing.emailConfirmed ) {
                        existing.emailConfirmed = false;
                    }

                    existing.email = email;
                    existing.firstName = firstName;
                    existing.lastName = lastName;
                    
                    existing.save().then(() => {
                        res.status(200).send({
                            message: 'Account has been updated successfully',
                            firstName: firstName,
                            lastName: lastName,
                            email: email
                        });
                    });
                });
            });
        });
    },

    /**
     * Processes a POST request to update an account password
     * @param {*} req Request
     * @param {*} res Response
     */
    updatePassword: (req, res) => {
        const id = req.body.id;
        const password = req.body.password;
        const token = req.body.token;

        auth.authenticate(token, (result) => {
            if ( !result.status === true ) {
                res.status(401).send({
                    message: result.message
                });

                return;
            }

            User.findById(id, (err, user) => {
                if ( err ) {
                    res.status(401).send({
                        message: 'Failed to establish a connection to the authentication server'
                    });

                    return;
                }

                if ( !user ) {
                    res.status(404).send({
                        message: 'Account not found'
                    });

                    return;
                }

                bcrypt.hash(password, parseInt(SALT_ROUNDS), (err, hash) => {
                    if ( err ) {
                        res.status(401).send({
                            message: 'Failed to create password hash'
                        });

                        return;
                    }

                    user.password = hash;

                    user.save().then(() => {
                        res.status(200).send({
                            message: 'Password updated successfully'
                        });

                        console.log('Updated password for ' + user._id);
                    });
                });
            });
        });
    }
}