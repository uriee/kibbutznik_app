const chai = require('chai');
const chaiHttp = require('chai-http');
const { v4: uuidV4 } = require('uuid');
const server = require('../../server'); // Adjust path as needed

chai.use(chaiHttp);
const expect = chai.expect;

describe('API Tests', () => {
  let FirstMember, AnotherMember1, AnotherMember2;
  let communityId;

  it('Create FirstMember user', (done) => {
    // Assume endpoint and request body to create user
    chai.request(server)
      .post('/users')
      .send({ username: 'FirstMember' })
      .end((err, res) => {
        console.log("tttw5535663",res.body.user_id)
        FirstMember = res.body.user_id;
        expect(res).to.have.status(201);
        done();
      });
  });


  it('Create a new community with member called "TastyTest" using FirstMember', (done) => {

    setTimeout(() => { 
        const newCommunity = {
            parent_community_id: '00000000-0000-0000-0000-000000000000',
            name: 'TastyTest',
            user_id: FirstMember,
          };
        console.log(newCommunity)
        chai.request(server)
        .post('/communities/createWithUser')
        .send(newCommunity)
        .end((err, res) => {
            communityId = res.body.community_id;
            expect(res).to.have.status(201);
            done();
        });
    },150)
  });

  
  it('Create AnotherMember_1 and AnotherMember_2 users', (done) => {
    // Create AnotherMember_1
    setTimeout(() => { 
        chai.request(server)
        .post('/users')
        .send({ username: 'AnotherMember_1' })
        .end((err, res) => {
            console.log("popopopopop",res.body)
            AnotherMember1 = res.body.user_id;
            expect(res).to.have.status(201);

            // Create AnotherMember_2
            chai.request(server)
            .post('/users')
            .send({ username: 'AnotherMember_2' })
            .end((err, res) => {
                AnotherMember2 = res.body.user_id;
                expect(res).to.have.status(201);
                done();
            });
        });
    },150)
  });


  it('Create 2 Membership proposals for AnotherMember_1 and AnotherMember_2', (done) => {
    // Proposal for AnotherMember_1
    setTimeout(() => { 
        let text = "Hey let me in. AnotherMember1"
        console.log("AnotherMember1", AnotherMember1)
        chai.request(server)
        .post('/proposals')
        .send({ community_id: communityId,  user_id: AnotherMember1, proposal_type: 'Membership', proposal_text: text})
        .end((err, res) => {
            console.log("q1:", res.status, res.body, err)
            expect(res).to.have.status(201);
            let text = "Hey let me in. AnotherMember2"
            // Proposal for AnotherMember_2
            chai.request(server)
            .post('/proposals')
            .send({ community_id: communityId, user_id: AnotherMember2, proposal_type: 'Membership', proposal_text: text})
            .end((err, res) => {
                console.log("q2:", res.status, res.body)
                expect(res).to.have.status(201);
                done();
            });
        });
    },700)
  });

  it('Create a proposal to change the community variable variable_type = "MinCommittee" to 1', (done) => {
    setTimeout(() => { 
        chai.request(server)
        .post('/proposals')
        .send({
            community_id: communityId,
            user_id: FirstMember,
            proposal_type: 'ChangeVariable',
            proposal_text: 'MinCommittee',
            val_text: 'uri'
        })
        .end((err, res) => {
            console.log("q3:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },700)
  });

  it('Create a proposal to add a new statement', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/proposals')
        .send({
            community_id: communityId,
            user_id: FirstMember,
            proposal_type: 'AddStatement',
            proposal_text: 'Add a new statement for better clarity',
        })
        .end((err, res) => {
            console.log("q4:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },700)
  });


});
