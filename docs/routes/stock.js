const {Router} = require('express')
const Stock = require('../models/stock')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', auth, async (req, res) => {
    res.render('stock', {
        title: 'Melcard - Акция'
    })
})

router.post('/', auth, async (req, res) => {
    try {
        const stock = new Stock({
            name: req.body.stockName,
            string1: req.body.string1,
            string2: req.body.string2
        })

        await stock.save()
        res.redirect('/')
    } catch (err) {
        console.log(err)
    }
})

router.get('/edit', auth, async (req, res) => {
    try {
        let stock = await Stock.find()
        stock = stock[0]
        
        res.render('stock-edit', {
            title: 'Melcard - Акция',
            stock
        })
    } catch (err) {
        console.log(err)
    }
})

router.post('/edit', auth, async (req, res) => {
    try {
        await Stock.findOneAndUpdate(req.body)
        res.redirect('/')
    } catch (err) {
        console.log(err)
    }
})

module.exports = router