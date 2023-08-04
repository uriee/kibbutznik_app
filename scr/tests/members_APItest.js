const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server.js');
const expect = chai.expect;

chai.use(chaiHttp);

const userId = '181780de-92d2-45ef-9bcd-31fd7954383a';
const communityId = 'e678e334-cae0-4a62-b5a4-8c665b891312';
const seniority = 1;

describe('Members API', () => {

  it('GET /members/:userId', (done) => {
    chai.request(server)
      .get(`/members/${userId}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('POST /members', (done) => {
    chai.request(server)
      .post('/members')
      .send({ userId, communityId })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('GET /members/:userId/support', (done) => {
    chai.request(server)
      .get(`/members/${userId}/support`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('GET /members/:userId/votes', (done) => {
    chai.request(server)
      .get(`/members/${userId}/votes`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('GET /members/:communityId/seniority/gte/:seniority', (done) => {
    chai.request(server)
      .get(`/members/${communityId}/seniority/gte/${seniority}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('GET /members/:communityId/seniority/lte/:seniority', (done) => {
    chai.request(server)
      .get(`/members/${communityId}/seniority/lte/${seniority}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

});