const passport = require('passport');
var DiscordStrategy = require('passport-discord').Strategy;
const axios = require('axios')
const config = require('../config.json')

module.exports = function(passport) {
     
    passport.use(
        new DiscordStrategy(
            {
                clientID: config.bot.id, 
                clientSecret: config.bot.secretId, 
                callbackURL: config.bot.callbackUrl, 
                scope: config.bot.scope
            },

        async (accessToken, refreshToken, profile, done) => {
                    
            axios.get('https://discord.com/api/v10/users/@me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }).then(response => {

                done(null, response.data)

            }).catch(error => {

                done(error, null);

            })
        })
    )

    passport.serializeUser((user, done) => { done(null, user) })
    passport.deserializeUser((user, done) => { done(null, user) })
}
