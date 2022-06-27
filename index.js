require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const moment = require('moment');
const router = express.Router();
const cors = require('cors');
const shortid = require('shortid');
const mongoose = require('mongoose');
const e = require('express');
// const {Schema} = mongoose;
mongoose.connect("mongodb+srv://sahilsaini110:sTweqfvmhk2yXfOY@cluster0.qm4f15a.mongodb.net/?retryWrites=true&w=majority" || 'mongodb://localhost/exercise-track' );

// require('./models');
// const User = mongoose.model('User');
// const Exercise = mongoose.model('Exercise');


// const api = require('./routes/exercise');
// const api2 = require('./routes/index');
// app.use('/api', api);
// app.use('/api', api2);

// schema1 
const UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    username: {
        type: String,
        unique: true,
        required: true
    }
})

const UserInfo = mongoose.model('User', UserSchema);

//  schema2
const ExerciseSchema = new mongoose.Schema({
  description: {
      type: String,
      required: true,
      maxlength: [25, 'Description too long, not greater than 25']
  },
  duration: {
      type: Number,
      required: true,
      min: [1, 'Duration too short, at least 1 minute']
  },
  date: {
      type: Date, 
      default: Date.now
  },
  userId: {
      type: String,
  }
})

const ExerciseInfo = mongoose.model('Exercise', ExerciseSchema);

// schema3
const logSchema = new mongoose.Schema({
  "username":  String,
  "count": Number,
  "log": Array
});

LogInfo = mongoose.model('log', logSchema);

// middleware
app.use(cors());
// app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
// // Not found middleware
// app.use((req, res, next) => {
//   return next({status: 404, message: 'not found'})
// });

// // Error Handling middleware
// app.use((err, req, res, next) => {
//   let errCode, errMessage

//   if (err.errors) {
//     // mongoose validation error
//     errCode = 400 // bad request
//     const keys = Object.keys(err.errors)
//     // report the first validation error
//     errMessage = err.errors[keys[0]].message
//   } else {
//     // generic or custom error
//     errCode = err.status || 500
//     errMessage = err.message || 'Internal Server Error'
//   }
//   res.status(errCode).type('txt')
//     .send(errMessage)
// });
 
app.post("/api/users", (req, res) => {
  console.log("ji");
 UserInfo.find({"username" : req.body.username}, (err, userData) => {
  if (err){
    console.log(err)
  } else {
    if (userData.length === 0){
      const test = new UserInfo({
        "_id": req.body.id,
        "username": req.body.username
      })    
      test.save((err, data) => {
        if (err){
          console.log(err)
        } else {
          res.json({
            "_id":data.id,
            "username": data.username
          })
        }
      })
    } else {
      res.send ("user hai phle se")
    }
  }
 })
});

app.post('/api/users/:_id/exercises', (req, res) =>{
  let idJson = { "id": req.params._id};
  let checkedDate = new Date(req.body.date);
  let idToCheck = idJson.id;
  let noDateHandler = () => {
    if (checkedDate instanceof Date && !isNaN(checkedDate)){
      return checkedDate
    } else {
      checkedDate = new Date();
    }
  }

  UserInfo.findById(idToCheck, (err, data) =>{
    noDateHandler(checkedDate);

    if(err) {
      console.log("err", err);
    } else {
      const test = new ExerciseInfo({
        "username": data.username,
        "description": req.body.description,
        "duration": req.body.duration,
        "date": checkedDate.toDateString()
      })
      test.save((err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log("saved exercise acchese");
          res.json({
            "_id": idToCheck,
            "username": data.username,
            "description": data.description,
            "duration": data.duration,
            "date": data.date.toDateString()
          })
        }
      })
    }
  })
})


app.get('/api/users/:_id/logs', (req, res, next) => {
  let { userId, from, to, limit } = req.query;
  let id = req.params._id;
  from = moment(from, 'YYYY-MM-DD').isValid() ? moment(from, 'YYYY-MM-DD') : 0;
  to = moment(to, 'YYYY-MM-DD').isValid() ? moment(to, 'YYYY-MM-DD') : moment().add(1000000000000);
  UserInfo.findById(id).then(user => {
      if (!user) throw new Error('Unknown user with _id');
      ExerciseInfo.find({ userId })
          .where('date').gte(from).lte(to)
          .limit(+limit).exec()
          .then(log => res.status(200).send({
              _id: userId,
              username: user.username,
              count: log.length,
              log: log.map(o => ({
                  description: o.description,
                  duration: o.duration,
                  date: moment(o).format('ddd MMMM DD YYYY')
              }))
          }))
  })
      .catch(err => {
          console.log(err);
          res.status(500).send(err.message);
      })
})


// app.get('/api/users/:_id/logs', (req, res) => {
//   const {from, to , limit} = req.query;
//   let idJson = {"id": req.params._id};
//   let idToCheck = idJson.id;

//   UserInfo.findById(idToCheck, (err, data) =>{
//     var query = {
//       username: data.username
//     }
//     if(from !== undefined && to === undefined){
//       query.date ={$gte: new Date(from)}
//     } else if (to !== undefined && from === undefined) {
//       query.date = {$lte: new Date(to)}
//     } else if (from !== undefined && to !== undefined){
//       query.date = {$gte: new Date(from), $lte: new Date(to)}
//     }

//     let limitChecker = (limit) =>{
//       let maxLimit = 100;
//       if(limit) {
//         return limit;
//       } else {
//         return maxLimit
//       }
//     }

//     if(err) {
//       console.log(err)
//     } else{
//       ExerciseInfo.find((query), null, {limit: limitChecker(+limit)}, (err, data) => {
//         let loggedArray = [];
//         if (err){
//           console.log(err)
//         } else {
//           let documents = docs;
//           let loggedArray = documents.map((item) => {
//             return {
//               "description": item.description,
//               "duration": item.duration,
//               "log": item.date.toDateString()
//             }
//           })

//           const test = new LogInfo({
//             "username": data.username,
//             "count": loggedArray.length,
//             "log": loggedArray
//           })
//           test.save((err, data) => {
//             if(err) {
//               console.log(err)
//             }else {
//               console.log("save hpogya");
//               res.json({
//                 "_id": idToCheck,
//                 "username": data.username,
//                 "count": data.count,
//                 "log": loggedArray
//               })
//             }
//           })
//         }
//       })
//     }
//   })
// })



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});