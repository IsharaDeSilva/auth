const express = require('express')

//jwt
const jwt = require('jsonwebtoken')

const router = express.Router()
const User = require('../models/user')

const mongoose = require('mongoose')

const db = "mongodb+srv://name:password@eventdb.c9gf1.mongodb.net/dbname?retryWrites=true&w=majority"

mongoose.connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true
    } ,err => {
   if(err){
       console.error('Error!' +err)
   }else {
       console.log('connected to mongodb')
   }
  })

  //verify the back end token
  //middle ware nothing but a function
  function verifyToken(req, res, next){
      if(!req.headers.authorization){
          return res.status(401).send('Unauthorized request')
      }
      let token = req.headers.authorization.split(' ')[1]
      if(token == 'null'){
        return res.status(401).send('Unauthorized request')
       }
      let payload = jwt.verify(token, 'secretKey')
      if(!payload){
        return res.status(401).send('Unauthorized request')
       }
       req.userId = payload.subject
       next()
  }


router.get('/', (req, res) => {
    res.send('From API route')
})

router.post('/register', (req, res) => {
    let userData = req.body
    //user model
    let user = new User(userData)
    user.save((error, registeredUser) => {
        if(error){
            console.log(error)
        }else{
            //payload is an object and it contains register user id
            let payload = { subject : registeredUser._id }
            
            //create a token and this token contains a jwt
            let token = jwt.sign(payload, 'secretKey')

            //send this token as an object insted of registerdUser
            // res.status(200).send(registeredUser)
            res.status(200).send({ token })
        }
    })
})


router.post('/login', (req, res) => {
    let userData = req.body
    //user model
    User.findOne({email:userData.email},(error,user) => {
        if(error){
            console.log(error)
        }else{
            if(!user){
                res.status(401).send('Invalid email')
            }else
            if (user.password !== userData.password){
                res.status(401).send('Invalid password')
            } else{
                let payload = { subject : user._id }
                let token = jwt.sign(payload, 'secretKey')
                res.status(200).send({token})
            }
        }
    })
})

router.get('/events', (req,res) => {
    let events = [
        {
            "_id" : "1",
            "name": " maths lecture",
            "description": "you have a lecture",
            "date": "2020-10-15T18:25:43.511Z"
        },
        {
            "_id" : "2",
            "name": "awreness session",
            "description": "you have an awreness session",
            "date": "2020-10-15T18:25:43.511Z"
        },
        {
            "_id" : "3",
            "name": "lunch break",
            "description": "you have a lunch break",
            "date": "2020-10-15T18:25:43.511Z"
        },
        {
            "_id" : "4",
            "name": "semantic lecture",
            "description": "you have a lecture",
            "date": "2020-10-15T18:25:43.511Z"
        },
        {
            "_id" : "5",
            "name": "cluster lecture",
            "description": "you have a lecture",
            "date": "2020-10-15T18:25:43.511Z"
        }
    ]
        res.json(events)
})

//add middleware here
//after verifying the token then only it lets user to navigate special events
router.get('/special', verifyToken, (req,res) => {
    let events = [
        {
            "_id" : "1",
            "name": " maths lecture",
            "description": "you have a lecture",
            "date": "2020-10-15T18:25:43.511Z"
        },
        {
            "_id" : "2",
            "name": "awreness session",
            "description": "you have an awreness session",
            "date": "2020-10-15T18:25:43.511Z"
        },
        {
            "_id" : "3",
            "name": "lunch break",
            "description": "you have a lunch break",
            "date": "2020-10-15T18:25:43.511Z"
        },
        {
            "_id" : "4",
            "name": "semantic lecture",
            "description": "you have a lecture",
            "date": "2020-10-15T18:25:43.511Z"
        },
        {
            "_id" : "5",
            "name": "cluster lecture",
            "description": "you have a lecture",
            "date": "2020-10-15T18:25:43.511Z"
        }
    ]
        res.json(events)
})
//as get request no need of postman
// can check on browser

module.exports = router
