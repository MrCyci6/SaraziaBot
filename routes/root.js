const express = require('express');
const router = express.Router();

const config = require('../config.json')

router.get('/', (req, res) => {
	res.redirect('/tickets')
})

module.exports = router