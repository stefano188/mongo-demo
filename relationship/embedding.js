const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const followerSchema = new mongoose.Schema({
  name: 'String'
});

const Follower = mongoose.model('Follower', followerSchema);

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  author: {
    type: authorSchema,
    required: true
  },
  followers: [followerSchema]
}));

async function createCourse(name, author, followers) {
  const course = new Course({
    name, 
    author,
    followers
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function updateAuthor(courseId, authorName) {
  // Query first approach
  // const course = await Course.findById(courseId);
  // course.author.name = authorName;
  // course.save();

  // Update first approach
  const result = await Course.update({ _id: courseId }, {
    $set: {
      'author.name': authorName
    }
  })
  console.log('author updated',result);
}

async function removeAuthor(courseId) {
  // Update first approach
  const result = await Course.update({ _id: courseId }, {
    $unset: {
      'author': ''
    }
  })
  console.log('author updated',result);
}

async function addFollower(courseId, follower) {
  const course = await Course.findById(courseId);
  course.followers.push(follower);
  course.save();
}

async function removeFollower(courseId, followerId) {
  const course = await Course.findById(courseId);
  const follower = course.followers.id(followerId);
  follower.remove();
  course.save();
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}

// createCourse(
//   'Angular Course', 
//   new Author({ name: 'Mosh Hamedani' }),
//   [
//     new Follower({ name: 'Claudiano' }),
//     new Follower({ name: 'Mariano' }),
//   ]);

// updateAuthor('5e907ea99d4141bb8620355b', 'John Smith');
// removeAuthor('5e9082a419389dbc2163e976');
// addFollower('5e9087bd8b6b87be9c71fc4f', new Follower({ name: 'Fariano' }));
// removeFollower('5e9087bd8b6b87be9c71fc4f', '5e9087bd8b6b87be9c71fc4e');

listCourses();