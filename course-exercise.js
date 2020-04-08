
const mongoose = require('mongoose')/*.set('debug', true)*/;
mongoose.connect('mongodb://localhost/mongo-exercises', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to mongo-exercises'))
    .catch((err) => console.error('error connecting to mongo-exercise', err));

var ObjectId = require('mongoose').Types.ObjectId;

const schema = new mongoose.Schema({
    //_id: mongoose.ObjectId,
    tags: [ String ],
    date: { type: Date, default: Date.now },
    name: String,
    author: String,
    isPublished: Boolean,
    price: Number
});

const Course = mongoose.model('Course', schema);

async function getAllCourses() {
    return await Course
        .find()
        .sort({name: 1})
        .select({name: 1, author: 1})
}

async function getCourses1() {
    return await Course
        .find()
        .and([{isPublished: true}, {tags: 'backend'}])
        .sort({name: 1})
        .select({name: 1, author: 1})
}

async function getCourses2() {
    return await Course
        .find({ isPublished: true, tags: { $in: ['frontend','backend'] } })
        //.or([ { tags: 'frontend' }, { tags: 'backend' } ])
        .sort({price: -1})
        .select({name: 1, author: 1, price: 1})
}

async function getCourses3() {
    return await Course
        .find({isPublished: true})
        .or([ 
            { price: { $gte: 15 } }, 
            { name: /.*by.*/i} 
        ])
        .sort({price: -1})
        .select({name: 1, author: 1, name: 1, price: 1, isPublished: 1})
}

async function getCourseById(id) {
    const course = await Course.findById(new ObjectId(id));
    //const course = await Course.findById(id);
    //console.log(course);
    return course;
}

// Query First Approach
async function updateCourse(id, authorName) {
    // First query the document by id
    const course = await Course.findById(id);
    if (!course) return;

    // update the properties
    course.author = authorName;
    course.isPublished = true;
    
    // save the document (update)
    const courseUpdated = await course.save();
    return courseUpdated;
}

// Update First Approach
async function findAndUpdateCourse(id, authorName) {
    const courseUpdated = await Course.findByIdAndUpdate(
        id, 
        {
            $set: {
                author: authorName,
                isPublished: false
            }
        }, 
        { new: true }
    );
    return courseUpdated;
}

async function findAndRemoveCourse(id) {
    const courseRemoved = await Course.findByIdAndRemove(id);
    return courseRemoved;
}

async function run() {
    const courses = await getAllCourses();
    var i = 1;
    courses.forEach(async (el) => {
        const course = await getCourseById(el.id);
        const courseUpdated = await updateCourse(course.id, course.author + (i++));
        console.log('updated', courseUpdated);
    });

    //findAndUpdateCourse('5a6900fff467be65019a9001', 'Mosh Hamedani');
    //findAndRemoveCourse('5a68fdf95db93f6477053ddd');
}

run();
