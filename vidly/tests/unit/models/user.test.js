const { iteratee } = require("lodash")
const {User} = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require("mongoose");

describe('user.generateAuthToken', () => {
    it('should return a valid JWT', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        }
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        console.log('payload', payload)
        console.log('decoded', decoded);

        // expect(decoded).toMatchObject(payload);
        // payload { _id: '5fc131b49102365af19eae0e', isAdmin: true }
        // decoded { id: '5fc131b49102365af19eae0e', isAdmin: true, iat: 1606496692 }

        expect(decoded).toHaveProperty('id');
        expect(decoded).toHaveProperty('isAdmin');
    });
});
