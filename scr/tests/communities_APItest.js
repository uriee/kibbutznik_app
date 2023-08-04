const chai = require('chai');
const chaiHttp = require('chai-http');
const { v4: uuidV4 } = require('uuid'); 
const server = require('../../server'); // adjust path as needed

chai.use(chaiHttp);
const expect = chai.expect;

describe('Communities API', () => {
  let parentCommunityId;
  let childCommunityId;
  const newCommunity = {
    parent_community_id: '00000000-0000-0000-0000-000000000000',
    name: 'parentCommunity',
    user_id: uuidV4('54d14c5b-c05e-4e1b-8c8c-8608dc3541c5'),
  };

  it('POST /communities/creatWithUser', (done) => {
    chai.request(server)
      .post('/communities/creatWithUser')
      .send(newCommunity)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        parentCommunityId = res.body.community_id;
        done();
      });
  });

  it('POST /communities', (done) => {
    setTimeout(() => {
      chai.request(server)
        .post('/communities')
        .send({ parent_community_id: parentCommunityId, name: 'Child Community' })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          childCommunityId = res.body.community_id;
          done();
        });
    }, 20); // 1-second delay
  });

  it('GET /communities/:id', (done) => {
    setTimeout(() => {
      chai.request(server)
        .get(`/communities/${parentCommunityId}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.community_id.toString()).to.equal(parentCommunityId.toString());
          done();
        });
    }, 200); // 2-second delay
  });

  it('GET /communities/:id/isparent/:parentId', (done) => {
    setTimeout(() => {
      chai.request(server)
        .get(`/communities/${childCommunityId}/isparent/${parentCommunityId}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.isParent).to.equal(true);
          done();
        });
    }, 200); // 2-second delay
  });

  it('GET /communities/:id/ischild/:childId', (done) => {
    setTimeout(() => {
      chai.request(server)
        .get(`/communities/${parentCommunityId}/ischild/${childCommunityId}`)
        .end((err, res) => {
          console.log("xxx333", res.body)
          expect(res.status).to.equal(200);
          expect(res.body.isChild).to.equal(true);
          done();
        });
    }, 200); // 2-second delay
  });

  // Other GET tests related to the parent community
  it('GET /communities/:id/parents', (done) => {
    setTimeout(() => {
      chai.request(server)
        .get(`/communities/${parentCommunityId}/parents`)
        .end((err, res) => {
          console.log("xxx4444", res.body)
          expect(res.status).to.equal(200);
          // additional assertions based on expected parents
          done();
        });
    }, 200); 
  });

  it('GET /communities/:id/members', (done) => {
    setTimeout(() => {
      console.log(`/communities/${parentCommunityId}/members`)
      chai.request(server)
        .get(`/communities/${parentCommunityId}/members`)
        .end((err, res) => {
          console.log("xxx555", res.body)
          expect(res.status).to.equal(200);
          // additional assertions based on expected members
          done();
        });
    }, 200); // 2-second delay
  });

  it('GET /communities/:id/statements', (done) => {
    setTimeout(() => {
      chai.request(server)
        .get(`/communities/${parentCommunityId}/statements`)
        .end((err, res) => {
          console.log("xxx6666", res.body)
          expect(res.status).to.equal(200);
          // additional assertions based on expected statements
          done();
        });
    }, 200); // 2-second delay
  });

  it('GET /communities/:id/proposals', (done) => {
    setTimeout(() => {
      chai.request(server)
        .get(`/communities/${parentCommunityId}/proposals`)
        .end((err, res) => {
          console.log("xxx7777", res.body)
          expect(res.status).to.equal(200);
          // additional assertions based on expected proposals
          done();
        });
    }, 200); // 2-second delay
  });

  // Tests related to children communities using parent community ID
  it('GET /communities/:id/children', (done) => {
    setTimeout(() => {
      chai.request(server)
        .get(`/communities/${parentCommunityId}/children`)
        .end((err, res) => {
          console.log("xxxzzz", res.body)
          expect(res.status).to.equal(200);
          expect(res.body[0].community_id).to.equal(childCommunityId); // assuming the child community will be the first one
          done();
        });
    }, 200); // 2-second delay
  });
});
