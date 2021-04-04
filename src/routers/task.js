const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

// Create express router.
const router = express.Router();

// Create task REST API route/endpoint.
router.post('/tasks', auth,  async(req, res) => {
  // create new task using mongoose model and data send with with the request body.
  // const task = new Task(req.body);

  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    // save task to mongodb database.
    await task.save();
    res.status(201).send(task);
  } catch(e) {
    res.status(400).send(e);
  };
  // task.save()
  // .then(task => {
  //   res.status(201).send(task);
  // })
  // .catch(e => {
  //   res.status(400).send(e);
  // });
});

// Get tasks REST API route/endpoint.
router.get('/tasks', auth,  async(req, res) => {
  const match = {};

  if(req.query.completed) {
    match.completed = req.query.completed === 'true';
  }
  try {
    // Retrieve all tasks from mongodb
    // const tasks = await Task.find({ owner: req.user._id });
    // res.send(tasks);
    // alternative
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip)
      }
    }).execPopulate();
    res.send(req.user.tasks);
  } catch(e) {
    res.status(500).send()
  };

  // Task.find({})
  // .then(tasks => {
  //   res.send(tasks);
  // })
  // .catch(e => {
  //   res.status(500).send()
  // });
});

// Get a specific task REST API route/endpoint.
router.get('/tasks/:id', auth, async(req, res) => {
  const _id = req.params.id;

  try {
    // Retrieve task by it's id and owned by the currently logged in user.
    // const task = await Task.findById(_id);
    const task = await Task.findOne({ _id, owner: req.user._id });
    if(!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch(e) {
    res.status(500).send();
  };
  // Task.findById(_id)
  // .then(task => {
  //   if(!task) {
  //     return res.status(404).send();
  //   }
  //   res.send(task);
  // })
  // .catch(e => {
  //   res.status(500).send();
  // });
});

router.patch('/tasks/:id', auth, async(req, res) => {

  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if(!isValidOperation) {
    return res.status(400).send({ error: 'invalid updates!' });
  }

  try {
    // const task = await Task.findById(req.params.id);
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    // const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
    if(!task) {
      return res.status(404).send();
    }

    updates.forEach(update => task[update] = req.body[update]);
    // Save task.
    await task.save();
    res.send(task);
  } catch(e) {
    res.status(400).send(e);
  }
});

// delete task endpoint.
router.delete('/tasks/:id', auth, async(req, res) => {
  const _id = req.params.id;

  try {
    // const task = await Task.findByIdAndDelete(_id);
    // Find task created by currently loggedin user and that matches id in url param.
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if(!task) {
      res.status(404).send();
    }
    res.send(task);
  } catch(e) {
    res.status(500).send();
  };
});

module.exports = router;