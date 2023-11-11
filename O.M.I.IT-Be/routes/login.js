const express = require('express')
const login = express.Router()
const bcrypt = require('bcrypt')
const AuthorModel = require('../models/user')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middlewares/verifyToken')
require('dotenv').config()


login.post('/login', async (req, res) => {
    const authors = await AuthorModel.findOne({ email: req.body.email })

    if (!authors) {
        return res.status(404).send({
            message: 'Nome utente errato o inesistente',
            statusCode: 404
        })
    }

    const validPassword = await bcrypt.compare(req.body.password, authors.password)

    if (!validPassword) {
        return res.status(400).send({
            statusCode: 400,
            message: 'Email o password errati.'
        })
    }

    // generazione token
    const token = jwt.sign({
        id: authors._id,
        firstName: authors.firstName,
        lastName: authors.lastName,
        email: authors.email,
        birthDate: authors.birthDate,
        avatar: authors.avatar,
    }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    })

    res.header('loggedInUser', token).status(200).send({
        message: 'Login effettuato con successo',
        statusCode: 200,
        token
    })
})

// Rotta per ottenere l'utente collegato al token di accesso
login.get('/me', verifyToken, async (req, res) => {
    // L'utente associato al token di accesso è memorizzato in req.user
    const userId = req.user.id;

    try {
        const user = await AuthorModel.findById(userId);
        if (!user) {
            return res.status(404).send({
                message: 'Utente non trovato',
                statusCode: 404
            });
        }

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({
            message: 'Errore nel recupero dell\'utente',
            statusCode: 500
        });
    }
});



module.exports = login;