const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

/* CREATE EXPRESS APPLICATION. */
const app = express();

// Declare port.
const port = process.env.PORT;

/* EXPRESS MIDDLEWARE. */
// app.use((req, res, next) => {
//   res.status(503).send('The site is under maintenance please try back soon');
// });

// Parse icoming json to a JS object.
app.use(express.json());

// setup express routers.
app.use(userRouter);
app.use(taskRouter);

// START WEB SERVER.
app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});

// const jwt = require('jsonwebtoken');

// const myFunction = async() => {
//   const token = jwt.sign({ _id: 'abc1234' }, 'thisismynewcourse', { expiresIn: '7 days'});

//   console.log(token);

//   const data = jwt.verify(token, 'thisismynewcourse');
//   console.log(data);

// };

// myFunction();

/********************* */

// const pet = {
//   name: 'Hal'
// };

// pet.toJSON = function() {
//   return {}
// }


// console.log(JSON.stringify(pet));


/************************ */
// const Task = require('./models/task');
// const User = require('./models/user');

// const main = async() => {
//   // const task = await Task.findById('606720e7551d9a52b03b426a');
//   // await task.populate('owner').execPopulate();
//   // console.log(task.owner);
//   const user = await User.findById('60671f92b89ae55f242a15a0');
//   await (await user.populate('tasks')).execPopulate();
//   console.log(user.tasks);
// };

// main();
