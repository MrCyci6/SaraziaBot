const fs = require('fs')
const path = require('path')
const express = require('express');
const router = express.Router();

const config = require('../config.json')

// Logout
router.get('/logout', (req, res) => {
    req.logout(err => {
        if(err) return res.send({error: `An error as ocurred`})
    })
    
    res.redirect('/auth/discord');
})

router.get('/tickets', (req, res) => {
	if(req.isAuthenticated()) {
		try {

			if(config.owners.includes(req.user.id)) {

				fs.readdir("./tickets", 'utf-8', (err, data) => {
					if(err) {

						res.send({error: `Internal error`})
						console.log(`[API ERROR][TICKETS] - ${err}`)
						return
					}
					
                    const htmlLinks = data.sort((a, b) => String(b.split("_")[3]).replace(".html", "") - String(a.split("_")[3]).replace(".html", "")).map(file => `
<div class="col">
    <div class="card h-100"  >
        <div class="card-body">
          <h5 class="card-title">${file.split("_")[1]} | Date: ${String(file.split("_")[2]).replaceAll("-", "/")}</h5>
          <p class="card-text">Tu peux revoir ton ticket ici !</p>
          <a href="/tickets/${file}" class="btn btn-primary">Voir le ticket</a>
        </div>
      </div>
</div>
					`)

                    res.render('home',{
                        profile:req.user,
                        htmlLinks:htmlLinks.join('<br>')
                    })
				})

			} else {

				fs.readdir("./tickets", 'utf-8', (err, data) => {
					if(err) {

						res.send({error: `Internal error`})
						console.log(`[API ERROR][TICKETS] - ${e}`)
						return
					}

					let tickets = []
					data.forEach(ticket => {
						if(ticket.startsWith(req.user.id)) tickets.push(ticket)
					})
					
			

					const htmlLinks = tickets.sort((a, b) => String(b.split("_")[3]).replace(".html", "") - String(a.split("_")[3]).replace(".html", "")).map(file => `
<div class="col">
    <div class="card h-100"  >
        <div class="card-body">
          <h5 class="card-title">${file.split("_")[1]} | Date: ${String(file.split("_")[2]).replaceAll("-", "/")}</h5>
          <p class="card-text">Tu peux revoir ton ticket ici !</p>
          <a href="/tickets/${file}" class="btn btn-primary">Voir le ticket</a>
        </div>
      </div>
</div>
					`)

                    res.render('home',{
                        profile:req.user,
                        htmlLinks:htmlLinks.join('<br>')
                    })                       
				})
			}

		} catch (e) {
			res.send({error: `Internal error`})
			console.log(`[API ERROR][TICKETS] - ${e}`)
		}
	} else {
		res.redirect('/auth/discord')
	}
})

router.get('/tickets/:name', (req, res) => {
	if(req.isAuthenticated()) {

		try {
			
			let name = req.params.name

			if(config.owners.includes(req.user.id)) {

				if(name) {
					if(fs.existsSync(`./tickets/${name}`)) {
						
						fs.readFile(`./tickets/${name}`, 'utf-8', (err, data) => {
							if(err) {

								res.send({error: `Internal error`})
								console.log(`[API ERROR][TICKETS] - ${e}`)
								return
							}

							const filePath = path.join(__dirname, '../tickets', name);
							res.sendFile(filePath)
						})

					} else {
						res.send({error: `This ticket doesn't exist`})
					}
				} else {
					res.send({error: `This ticket doesn't exist`})
				}
			} else {
				if(name) {
					if(name.startsWith(req.user.id)) {
						if(fs.existsSync(`./tickets/${name}`)) {
							
							fs.readFile(`./tickets/${name}`, 'utf-8', (err, data) => {
								if(err) {

									res.send({error: `Internal error`})
									console.log(`[API ERROR][TICKETS] - ${e}`)
									return
								}

								const filePath = path.join(__dirname, '../tickets', name);
								res.sendFile(filePath)
							})

						} else {
							res.send({error: `This ticket doesn't exist`})
						}
					} else {
						res.send({error: `This ticket doesn't exist`})
					}

				} else {
					res.send({error: `This ticket doesn't exist`})
				}
			}

		} catch (e) {
			res.send({error: `Internal error`})
			console.log(`[API ERROR][TICKETS] - ${e}`)
		}
	} else {
		res.redirect('/auth/discord')	
	}
})

module.exports = router