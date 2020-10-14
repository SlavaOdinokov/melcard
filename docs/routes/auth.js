const {Router} = require('express')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')
const {loginValidators} = require('../utils/validators')
const User = require('../models/user')
const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        error: req.flash('error')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

router.post('/login', loginValidators, async (req, res) => {
    try {
        const {email, password} = req.body
        const candidate = await User.findOne({ email })

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login')
        }
        
        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)

            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/catalog')
                })
            } else {
                req.flash('error', 'Неверный пароль')
                res.redirect('/auth/login')
            }

        } else {
            req.flash('error', 'Неверный email')
            res.redirect('/auth/login')
        }

    } catch (err) {
        console.log(err)
    }
})

module.exports = router