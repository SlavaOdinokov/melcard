const {Router} = require('express')
const router = Router()

router.get('/', async (req, res) => {
    try {
        res.render('cart', {
            layout: 'cart',
            title: 'Melcard - Корзина'
        })
    } catch (err) {
        console.log(err)
    }
})

module.exports = router