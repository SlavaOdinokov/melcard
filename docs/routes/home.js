const {Router} = require('express')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const Door = require('../models/door')
const Stock = require('../models/stock')
const keys = require('../keys')
const backcallEmail = require('../emails/backcall')
const cartEmail = require('../emails/cart')
const router = Router()

const transporter = nodemailer.createTransport(sendgrid({
    auth: { api_key: keys.SENDGRID_API_KEY }
}))

router.get('/', async (req, res) => {
    try {
        const doors = await Door.find()
        const stock = await Stock.find()

        res.render('index', {
            title: 'Melcard',
            doors,
            stock
        })
    } catch (err) {
        console.log(err)
    }
})

router.post('/backcall', async (req, res) => {
    try {
        res.status(200)
        res.send('ok')
        await transporter.sendMail(backcallEmail(req.body))
    } catch (err) {
        console.log(err)
    }
})

router.post('/cart', async (req, res) => {
    try {
        res.status(200)
        res.send('ok')
        await transporter.sendMail(cartEmail(req.body))
    } catch (err) {
        console.log(err)
    }
})

module.exports = router