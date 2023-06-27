const express = require('express');
const passport = require('passport')
const router = express.Router();

const config = require('../config.json')

router.get('/auth/discord', passport.authenticate('discord', { scope: config.bot.scope }) )

router.get('/auth/discord/callback', passport.authenticate('discord', { failureRedirect: '/auth/discord', successRedirect: '/tickets' }) )

module.exports = router