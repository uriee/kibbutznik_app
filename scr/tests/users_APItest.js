const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server.js');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Users API', () => {
  let userId;

  describe('POST /users', () => {
    it('should create a user', (done) => {
      const user = {
        user_name: 'John Doe',
        password: 'password',
        about: 'About John',
        wallet_address: '0x1234567890ABCDEF'
      };

      chai.request(server)
        .post('/users')
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          userId = res.body.id;
          done();
        });
    });

    describe('GET /users/:id', () => {
      it('should get the user created in the previous test', (done) => {
        chai.request(server)
          .get(`/users/${userId}`)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.user_id).to.equal(userId);
            done();
          });
      });
    });

        // Test fetching all users
    it('GET /users', (done) => {
        chai.request(server)
        .get('/users')
        .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            done();
        });
    });
  });

  // Other tests (e.g., for GET /users) can go here
});