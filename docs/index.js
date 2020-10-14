const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const helmet = require('helmet')
const compression = require('compression')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const bcrypt = require('bcryptjs')
const csrf = require('csurf')
const flash = require('connect-flash')

const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const error404 = require('./middleware/error404')
const fileMiddleware = require('./middleware/file')
const keys = require('./keys')

const User = require('./models/user')
const homeRoutes = require('./routes/home')
const catalogRoutes = require('./routes/catalog')
const addRoutes = require('./routes/add')
const authRoutes = require('./routes/auth')
const stockRoutes = require('./routes/stock')
const cartRoutes = require('./routes/cart')

const app = express()
const hbs = exphbs.create({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbs-helper')
})
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async(req, res, next) => {
    try {
        const user = await User.findById('5f81bf6df63bb71bd4d732c9')
        req.user = user
        next()
    } catch (err) {
        console.log(err)
    }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}))

app.use(fileMiddleware.single('imgDoor'))
app.use(csrf())
app.use(flash())
app.use(helmet())
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        frameSrc: ["'self' https: 'unsafe-inline'"],
        styleSrc: ["'self' https: 'unsafe-inline'"],
        scriptSrc: ["'self' https: 'unsafe-inline'"],
        imgSrc: ["'self' https: 'unsafe-inline'"],
        fontSrc: ["'self' https: 'unsafe-inline'"]
    }
}))
app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/catalog', catalogRoutes)
app.use('/add', addRoutes)
app.use('/auth', authRoutes)
app.use('/stock', stockRoutes)
app.use('/cart', cartRoutes)
app.use(error404)

const PORT = process.env.PORT || 3000

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useUnifiedTopology: true, 
            useNewUrlParser: true, 
            useFindAndModify: false
        })

        const candidate = await User.findOne()
        if (!candidate) {
            const password = await bcrypt.hash('melCard01102020', 10)
            const user = new User({
                email: 'melcardsite@gmail.com',
                name: 'admin',
                password: password
            })
            await user.save()
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}...`)
        })
    } catch (err) {
        console.log(err)
    }
}

start()