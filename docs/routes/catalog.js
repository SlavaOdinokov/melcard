const {Router} = require('express')
const fs = require('fs')
const Door = require('../models/door')
const modelHelpers = require('../utils/model-helper')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', async (req, res) => {
    try {
        const doors = await Door.find().populate('userId', 'email name')
    
        res.render('catalog', {
            title: 'Melcard - Каталог',
            doors
        })
    } catch (err) {
        console.log(err)
    }
})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    
    try {
        const door = await Door.findById(req.params.id)
    
        res.render('door-edit', {
            title: `Melcard - Редактировать ${door.titleDoor}`,
            door
        })
    } catch (err) {
        console.log(err)
    }
})

router.post('/edit', auth, async (req, res) => {
    try {
        const door = await Door.findById(req.body.id)
        const {id} = req.body
        delete req.body.id
        
        if (req.file) {
            fs.unlink(`./${door.imgUrl}`, (err) => {
                if (err) { return console.log(err) }
                console.log('file deleted successfully')
            })

            req.body.imgUrl = req.file.path
        }

        req.body.specifications = [{
            specSteelThickness: req.body.specSteelThickness,
            specBladeThickness: req.body.specBladeThickness,
            specDoorThickness: req.body.specDoorThickness,
            specDoorWeight: req.body.specDoorWeight
        }]

        req.body.assembly1 = {
            assemblyLocks1: req.body.assemblyLocks1,
            assemblyClass1: req.body.assemblyClass1,
            assemblyType1: req.body.assemblyType1,
            assemblyCountry1: req.body.assemblyCountry1,
            assemblyBolts1: req.body.assemblyBolts1,
            assemblyKeys1: req.body.assemblyKeys1,
        }

        req.body.assembly2 = {
            assemblyLocks2: req.body.assemblyLocks2,
            assemblyClass2: req.body.assemblyClass2,
            assemblyType2: req.body.assemblyType2,
            assemblyCountry2: req.body.assemblyCountry2,
            assemblyBolts2: req.body.assemblyBolts2,
            assemblyKeys2: req.body.assemblyKeys2
        }
        
        modelHelpers(req.body)
        await Door.findByIdAndUpdate(id, req.body)
        res.redirect('/catalog')
    } catch (err) {
        console.log(err)
    }
})

router.post('/remove', auth,  async (req, res) => {
    try {
        const door = await Door.findById(req.body.id)
        await Door.deleteOne({ _id: req.body.id })
        
        fs.unlink(`./${door.imgUrl}`, (err) => {
            if (err) { return console.log(err) }
            console.log('file deleted successfully')
        })
        res.redirect('/catalog')
    } catch (err) {
        console.log(err)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const door = await Door.findById(req.params.id)
    
        res.render('door', {
            title: `Melcard - ${door.titleDoor}`,
            door
        })
    } catch (err) {
        console.log(err)
    }
})

module.exports = router