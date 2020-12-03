const request = require('supertest');
const mongoose = require('mongoose');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const app = require('../../index');
//let server;

describe('/api/genres', () => {
    // beforeEach(() => { 
    //     server = require('../../index');
    // });
    afterEach(async () => { 
        await Genre.remove({});
        // server.close(); 
    });

    describe('GET /', () => {
        it('Should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' },
            ]);
            const res = await request(app).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return genre with the given ID', async () => {
            const genres = await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' },
            ]);
            // console.log('populated genres: ', genres);
            const id0 = new mongoose.Types.ObjectId(genres.insertedIds['0']);
            // console.log(`id0 ${id0}`);

            const genre = await request(app).get('/api/genres/' + id0.toHexString());
            // console.log('result genre', genre.body);
            expect(genre.status).toBe(200);
            expect(genre.body).toHaveProperty('name', 'genre1');
            
            // console.log(`id0 = ${id0}  --  genre.body['_id'] ${genre.body['_id']}` );
            // let _id = JSON.stringify(genre.body['_id']);

            // console.log(`_id ${_id}`);
            // _id = _id.replace(/"/g,'');
            // console.log(`_id ${_id}`);
            
            // expect(_id).toBe(id0); // FAIL
        });

        it('should return 404 for invalid genre ID', async () => {
            const invalidId = 1;
            const genre = await request(app).get('/api/genres/' + invalidId);

            expect(genre.status).toBe(404);
        });

    });

    describe('POST /', () => {

        let token;
        let name;

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'Genre001';
        });

        // declare execute function template
        const exec = async () => {
            return await request(app)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        }

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 character', async () => {
            name = '1234';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 character', async () => {
            name = new Array(52).join('a');
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            const res = await exec();
            const genre = await Genre.find({ name });

            expect(res.status).toBe(200);
            expect(genre).not.toBe(null);
        });

        it('should return the genre if it is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', name);
        });

    });


});

