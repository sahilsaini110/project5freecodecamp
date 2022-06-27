// require('dotenv').config();
// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const logger = require('morgan');
// const moment = require('moment');
// const router = express.Router();
// const cors = require('cors');
// const shortid = require('shortid');
// const mongoose = require('mongoose');
// const e = require('express');
// // const {Schema} = mongoose;
// mongoose.connect("mongodb+srv://sahilsaini110:sTweqfvmhk2yXfOY@cluster0.qm4f15a.mongodb.net/?retryWrites=true&w=majority" || 'mongodb://localhost/exercise-track' );

// // require('./models');
// // const User = mongoose.model('User');
// // const Exercise = mongoose.model('Exercise');


// // const api = require('./routes/exercise');
// // const api2 = require('./routes/index');
// // app.use('/api', api);
// // app.use('/api', api2);

// // schema1 
// const UserSchema = new mongoose.Schema({
//     _id: {
//         type: String,
//         default: shortid.generate
//     },
//     username: {
//         type: String,
//         unique: true,
//         required: true
//     }
// })

// const UserInfo = mongoose.model('User', UserSchema);

// //  schema2
// const ExerciseSchema = new mongoose.Schema({
//   description: {
//       type: String,
//       required: true,
//       maxlength: [25, 'Description too long, not greater than 25']
//   },
//   duration: {
//       type: Number,
//       required: true,
//       min: [1, 'Duration too short, at least 1 minute']
//   },
//   date: {
//       type: Date, 
//       default: Date.now
//   },
//   userId: {
//       type: String,
//   }
// })

// const ExerciseInfo = mongoose.model('Exercise', ExerciseSchema);

// // schema3
// const logSchema = new mongoose.Schema({
//   "username":  String,
//   "count": Number,
//   "log": Array
// });

// LogInfo = mongoose.model('log', logSchema);

// // middleware
// app.use(cors());
// // app.use(logger('dev'));
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());
// app.use(express.static('public'));
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/views/index.html')
// });
// // // Not found middleware
// // app.use((req, res, next) => {
// //   return next({status: 404, message: 'not found'})
// // });

// // // Error Handling middleware
// // app.use((err, req, res, next) => {
// //   let errCode, errMessage

// //   if (err.errors) {
// //     // mongoose validation error
// //     errCode = 400 // bad request
// //     const keys = Object.keys(err.errors)
// //     // report the first validation error
// //     errMessage = err.errors[keys[0]].message
// //   } else {
// //     // generic or custom error
// //     errCode = err.status || 500
// //     errMessage = err.message || 'Internal Server Error'
// //   }
// //   res.status(errCode).type('txt')
// //     .send(errMessage)
// // });
 
// app.post("/api/users", (req, res) => {
//   console.log("ji");
//  UserInfo.find({"username" : req.body.username}, (err, userData) => {
//   if (err){
//     console.log(err)
//   } else {
//     if (userData.length === 0){
//       const test = new UserInfo({
//         "_id": req.body.id,
//         "username": req.body.username
//       })    
//       test.save((err, data) => {
//         if (err){
//           console.log(err)
//         } else {
//           res.json({
//             "_id":data.id,
//             "username": data.username
//           })
//         }
//       })
//     } else {
//       res.send ("user hai phle se")
//     }
//   }
//  })
// });

// app.post('/api/users/:_id/exercises', (req, res) =>{
//   let idJson = { "id": req.params._id};
//   let checkedDate = new Date(req.body.date);
//   let idToCheck = idJson.id;
//   let noDateHandler = () => {
//     if (checkedDate instanceof Date && !isNaN(checkedDate)){
//       return checkedDate
//     } else {
//       checkedDate = new Date();
//     }
//   }

//   UserInfo.findById(idToCheck, (err, data) =>{
//     noDateHandler(checkedDate);

//     if(err) {
//       console.log("err", err);
//     } else {
//       const test = new ExerciseInfo({
//         "username": data.username,
//         "description": req.body.description,
//         "duration": req.body.duration,
//         "date": checkedDate.toDateString()
//       })
//       test.save((err, data) => {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log("saved exercise acchese");
//           res.json({
//             "_id": idToCheck,
//             "username": data.username,
//             "description": data.description,
//             "duration": data.duration,
//             "date": data.date.toDateString()
//           })
//         }
//       })
//     }
//   })
// })


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
//       ExerciseInfo.find((query), null, {limit: limitChecker(+limit)}, (err, docs) => {
//         let loggedArray = [];
//         if (err){
//           console.log(err)
//         } else {

//           let documents = docs;
//           let loggedArray = documents.map((item) => {
//             return {
//               "description": item.description,
//               "duration": item.duration,
//               "date": item.date.toDateString()
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

// app.get('/api/users', (req,res) => {
//   UserInfo.find({}, (err, data) => {
//     if (err) {
//       res.send("haw");
//     } else {
//       res.json(data); 
//     }
//   })
// })


// const listener = app.listen(process.env.PORT || 3000, () => {
//   console.log('Your app is listening on port ' + listener.address().port)
// });

const express = require('express')
// const mySecret = process.env['MONGO_URI']
const shortid = require('shortid');
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const { Schema } = mongoose;

 const userSchema = new Schema ({
   "username": String,
   _id: {
            type: String,
            default: shortid.generate
        },
 })

const exerciseSchema = new Schema({
  "username": String,
  "date": Date,
  "duration": Number,
  "description": String,
})

const logSchema = new Schema({
  "username": String,
  "count": Number,
  "log": Array,
})

// Models
const UserInfo = mongoose.model('userInfo', userSchema);
const ExerciseInfo = mongoose.model('exerciseInfo', exerciseSchema);
const LogInfo = mongoose.model('logInfo', logSchema);

// Config
mongoose.connect("mongodb+srv://sahilsaini110:sTweqfvmhk2yXfOY@cluster0.qm4f15a.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true },
  () => { console.log("Connected to MONGO BONGO DB")}
)


// Middlware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Api Endpointsconsole

  // #1
app.post('/api/users', (req, res) => {
  UserInfo.find({ "username": req.body.username}, (err, userData) => {
    if (err) {
      console.log("Error with server=> ", err)
    } else {
      if (userData.length === 0) {
        const test = new UserInfo({
          "_id": req.body.id,
          "username": req.body.username,
        })

        test.save((err, data) => {
          console.log(data.username);
          if (err) {
            console.log("Error saving data=> ", err)
          } else {
            res.json({
              "_id": data.id,
              // "username": data.username,
            })
            console.log(data.username);
          }
        })
      } else {
        res.send("Username already Exists")
      }
    }
  })
})

  // #2
app.post('/api/users/:_id/exercises', (req, res) => {
  let idJson = { "id": req.params._id};
  let checkedDate = new Date(req.body.date);
  let idToCheck = idJson.id;

  let noDateHandler = () => {
    if (checkedDate instanceof Date && !isNaN(checkedDate)) {
      return checkedDate
    } else {
      checkedDate = new Date();
    }
  }

  UserInfo.findById(idToCheck, (err, data) => {
    noDateHandler(checkedDate);

    if (err) {
      console.log("error with id=> ", err);
    } else {
      const test = new ExerciseInfo({
        "username": data.username,
        "description": req.body.description,
        "duration": req.body.duration,
        "date": checkedDate.toDateString(),
      })

      test.save((err, data) => {
        if (err) {
          console.log("error saving=> ", err);
        } else {
          console.log("saved exercise successfully", data.username);
          res.json({
            "_id": idToCheck,
            "username": data.username,
            "description": data.description,
            "duration": data.duration,
            "date": data.date.toDateString(),
          })
        }
      })
    }
  })
})

  // #3

app.get('/api/users/:_id/logs', (req, res) => {
  const { from, to, limit } = req.query;
  let idJson = { "id": req.params._id };
  let idToCheck = idJson.id;

  // Check ID
  UserInfo.findById(idToCheck, (err, data) => {
    var query = {
      // username: data.username
    }

    if (from !== undefined && to === undefined) {
      query.date = { $gte: new Date(from)}
    } else if (to !== undefined && from === undefined) {
      query.date = { $lte: new Date(to) }
    } else if (from !== undefined && to !== undefined) {
      query.date = { $gte: new Date(from), $lte: new Date(to)}
    }

    let limitChecker = (limit) => {
      let maxLimit = 100;
      if (limit) {
        return limit;
      } else {
        return maxLimit
      }
    }

    if (err) {
      console.log("error with ID=> ", err)
    } else {
  
      ExerciseInfo.find((query), null, {limit: limitChecker(+limit)}, (err, docs) => {
        let loggedArray = [];
        if (err) {
          console.log("error with query=> ", err);
        } else {
  
          let documents = docs;
          let loggedArray = documents.map((item) => {
            return {
              "description": item.description,
              "duration": item.duration,
              "date": item.date.toDateString()
            }
          })
  
          const test = new LogInfo({
            // "username": data.username,
            "count": loggedArray.length,
            "log": loggedArray,
          })
  
          test.save((err, data) => {
            if (err) {
              console.log("error saving exercise=> ", err)
            } else {
              console.log("saved exercise successfully");
              res.json({
                "_id": idToCheck,
                // "username": data.username,
                "count": data.count,
                "log": loggedArray
              })
            }
          })
        }
      })
    }
  })
})

  // #4
app.get('/api/users', (req, res) => {
  UserInfo.find({}, (err, data) => {
    if (err) {
      res.send("No Users");
    } else {
      res.json(data);
    }
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
