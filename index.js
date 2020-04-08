
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to MongoDB ...'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

// create a Schema
const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [ String ],
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: { type: Number, default: 0 }
});

// compile the Schema and obtain a Class
const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
    // create an instance of the Class (i.e. create a document)
    const course = new Course({
        name: 'Angular Course',
        author: 'Mosh',
        tags: ['node', 'frontend'],
        isPublished: true
    });
    const result = await course.save();
    console.log('document saved', result);
}

async function getCourses() {

    // pagination
    const pageNumber = 2;
    const pageSize = 10;
    // /api/courses?pageNumber=2&pageSize=10

    const courses = await Course
        //.find({ author: 'Mosh', isPublished: true }) // find by author, isPublished equals to ..
        //.find({ price: { $gte: 10, $lt: 20 } }) // filter by range: 10 <= price < 20
        //.find({ price: { $in: [10, 15, 20] } }) // filter by in
        //.find({ author: /^Mosh/ }) // regex start with Mosh
        //.find({ author: /Hamedani$/ }) // regex end with Hamedani
        //.find({ author: /.*Mosh.*/i }) // regex contains Mosh.. /i case insensitive
        .find()
        //.or([ { author: 'Mosh' }, { isPublished: true } ])
        //.and([ { author: 'Mosh' }, { isPublished: true } ])
        
        // pagination. skip previous pages and limit to pageSize
        //.skip((pageNumber - 1) * pageSize)
        //.limit(pageSize)
        
        .sort({name: 1}) // ascending, -1 descending
        
        .select({ name: 1, tags: 1}) // select only the properties passed as arguments
        //.count() // returns the number of documents

    console.log(courses);
}

//createCourse();
//getCourses();

async function getCourse(id) {
    const course = await Course.findById(id);
    console.log('course',course);
    return course;
}

getCourse('5e8ca187e6ec366df136da0d');


