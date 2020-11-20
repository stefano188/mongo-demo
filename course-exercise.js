
const mongoose = require('mongoose')/*.set('debug', true)*/;
mongoose.connect(
        'mongodb://localhost/mongo-exercises', 
        { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to mongo-exercises'))
    .catch((err) => console.error('error connecting to mongo-exercise', err));

const schema = new mongoose.Schema({
    //_id: mongoose.ObjectId,
    author: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        //lowercase,
        //uppercase,
        //unique,
        trim: true,
        //...
    },
    name: { 
        type: String, 
        required: true,  // validation.. required field
        minlength: 3,
        maxlength: 100,
        match: /^\w+\w$/ // match any word character without spaces,
    }, 
    category: {
        type: String,
        required: true,
        enum: ['web', 'network', 'mobile'] // one of these values
    },
    tags: {
        type: Array,
        validate: {
            validator: function(value) {
                return (value && value.length > 0);
            },
            message: 'A course should have at least one tag',
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0,
        validate: {
            //isAsync: true, // deprecated.. should return a promise

            validator: (value) => new Promise((resolve, reject) => {
                console.log('validating price... value', value);
                if (value > 0) resolve(true);
                else reject('price error');
            }),
            message: 'Price should be grater than 0'
        },
        get: v => Math.round(v),
        set: v => Math.round(v)
    }
});

const Course = mongoose.model('Course', schema);

async function createCourse(course) {   
    try {
        await course.validate();
        const c = await course.save(course);
        return c;
    } catch (err) {
        //console.error('...',err.message);
        for (field in err.errors) {
            console.log(err.errors[field].message);
        }
    }
}

async function getAllCourses() {
    return await Course
        .find()
        .sort({name: 1})
        // .select({name: 1, author: 1})
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

async function getCourseById2(id) {
    const course = await Course.findById(id);
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

    // or even using the set method
    // course.set({
    //     author: authorName,
    //     isPublished: true
    // });
    
    // save the document (update)
    const courseUpdated = await course.save();
    return courseUpdated;
}

// Update First Approach
async function findAndUpdateCourse(id, authorName) {

    // Update the document and return the result of the execution
    // const courseUpdated = await Course.update({ _id: id }, {
    //     $set: {
    //         author: authorName,
    //         isPublished: false
    //     }
    // });

    // find the document, update, and return it
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
    // await Course.deleteOne({ _id: id })

    // return the document deleted
    const courseRemoved = await Course.findByIdAndRemove(id);
    return courseRemoved;
}

async function run() {
    const courses = await getAllCourses();
    var i = 1;
    courses.forEach(async (el) => {
        const course = await getCourseById2(el.id);
        const courseUpdated = await updateCourse(course.id, course.author + (i++));
        console.log('updated', courseUpdated);
    });

    //findAndUpdateCourse('5a6900fff467be65019a9001', 'Mosh Hamedani');
    //findAndRemoveCourse('5a68fdf95db93f6477053ddd');
}

//run();

var course1 = new Course({
    author: 'aeiou'
});

var course2 = new Course({
    // name: '21_3aAa',
    name: 'NodeJs',
    // author: 'aeiou',
    author: '  V.M.M Alx  ',
    category: 'web',
    tags: ['node'],
    price: 12.6
});

//createCourse(course1);
// createCourse(course2)
//     .then((result) => console.log('createCourse', result))
//     .catch((error) => console.error(error));

// run();

getCourseById2('5fb6757c93fd64685422ce28')
    .then(course => console.log(course))
    .catch(err => console.log(err));

// getAllCourses()
//     .then(courses => console.log(courses))
//     .catch(err => console.log(err));

