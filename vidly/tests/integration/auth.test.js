const request = require('supertest');
const {User} = require('../../models/user');
const {Genre} = require('../../models/genre');
const app = require('../../index');

describe('auth middleware', () => {

    beforeEach(() => {
        // server = require('../../index');
    });
    afterEach(async () => { 
        await Genre.remove({});
        // server.close();
    });

    let token;
    const exec = () => {
        return request(app)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre01' });
    };

    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    it('should return 401 if no token is provided', async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 401 if token is invalid', async () => {
        token = '1234';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });

});
