const mongoose = require('mongoose');

// connect mongoose to the mongodb database.
mongoose.connect(process.env.MONGODB_URL, { 
  useNewUrlParser: true, 
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});