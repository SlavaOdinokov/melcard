const {Router} = require('express')
const Door = require('../models/door')
const modelHelpers = require('../utils/model-helper')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Melcard - Добавить товар'
    })
})

router.post('/', auth,  async (req, res) => {
    try {
        modelHelpers(req.body)
        
        const door = new Door({
            titleDoor: req.body.titleDoor,
            imgUrl: req.file.path,
            priceDoor: req.body.priceDoor,
            oldPriceDoor: req.body.oldPriceDoor,
            classDoor: req.body.classDoor,
            badgeDoor1: req.body.badgeDoor1,
            badgeDoor2: req.body.badgeDoor2,
            specifications: [{
                specSteelThickness: req.body.specSteelThickness,
                specBladeThickness: req.body.specBladeThickness,
                specDoorThickness: req.body.specDoorThickness,
                specDoorWeight: req.body.specDoorWeight
            }],
            panelsParams: req.body.panelsParams,
            descDoor1: req.body.descDoor1,
            descDoor2: req.body.descDoor2,
            descDoor3: req.body.descDoor3,
            assembly1: {
                assemblyLocks1: req.body.assemblyLocks1,
                assemblyClass1: req.body.assemblyClass1,
                assemblyType1: req.body.assemblyType1,
                assemblyCountry1: req.body.assemblyCountry1,
                assemblyBolts1: req.body.assemblyBolts1,
                assemblyKeys1: req.body.assemblyKeys1,
            },
            assembly2: {
                assemblyLocks2: req.body.assemblyLocks2,
                assemblyClass2: req.body.assemblyClass2,
                assemblyType2: req.body.assemblyType2,
                assemblyCountry2: req.body.assemblyCountry2,
                assemblyBolts2: req.body.assemblyBolts2,
                assemblyKeys2: req.body.assemblyKeys2
            },
            userId: req.user
        })

        await door.save()
        res.redirect('/catalog')
    } catch (err) {
        console.log(err)
    }
})

module.exports = router