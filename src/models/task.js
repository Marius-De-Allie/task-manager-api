const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Create task mongoose model.

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

// Create new instance of task model.

// const myTask = new Task({
//   description: '   Study Nodejs  ',
//   // completed: false
// });

// Save new task instance to mongodb db.

// myTask.save()
// .then(task => {
//   console.log(task);
// })
// .catch(error => {
//   console.log('Error', error);
// });