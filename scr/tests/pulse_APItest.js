const chai = require('chai');
const chaiHttp = require('chai-http');
const { v4: uuidV4 } = require('uuid');
const server = require('../../server'); // Adjust path as needed

chai.use(chaiHttp);
const expect = chai.expect;

describe('API Tests', () => {
  let FirstMember, AnotherMember1, AnotherMember2;
  let membership1, membership2, changeVariable1, newStatement1, removeStatement1 , replaceStatement1 ,newStatement2, newAction1
  let newActionMember1, newActionMember2, endAction1, pulseId
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
            membership1 = res.body.proposal_id
            console.log("q1:", res.status, res.body, err)
            expect(res).to.have.status(201);
            let text = "Hey let me in. AnotherMember2"
            // Proposal for AnotherMember_2
            chai.request(server)
            .post('/proposals')
            .send({ community_id: communityId, user_id: AnotherMember2, proposal_type: 'Membership', proposal_text: text})
            .end((err, res) => {
                membership2 = res.body.proposal_id
                console.log("q2:", res.status, res.body)
                expect(res).to.have.status(201);
                done();
            });
        });
    },200)

    
  });

  it('Create a proposal to change the community variable variable_type = "MinCommittee" to 217', (done) => {
    setTimeout(() => { 
        chai.request(server)
        .post('/proposals')
        .send({
            community_id: communityId,
            user_id: FirstMember,
            proposal_type: 'ChangeVariable',
            proposal_text: 'MinCommittee',
            val_text: '217'
        })
        .end((err, res) => {
            changeVariable1 = res.body.proposal_id
            console.log("q3:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });
/*
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
            newStatement1 = res.body.proposal_id
            console.log("q4:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });

  it('Create a proposal to add a new statement', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/proposals')
        .send({
            community_id: communityId,
            user_id: FirstMember,
            proposal_type: 'AddStatement',
            proposal_text: 'Add a Another new statement',
        })
        .end((err, res) => {
            newStatement2 = res.body.proposal_id
            console.log("q4:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });
  */
  //------------------------------------------------------------------------

  it('Create support', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/support')
        .send({
            user_id: FirstMember,
            proposal_id: membership1,
            support: 1,
        })
        .end((err, res) => {
            console.log("q4:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });

  it('Create support', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/support')
        .send({
            user_id: FirstMember,
            proposal_id: membership2,
            support: 1,
        })
        .end((err, res) => {
            console.log("q4:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });

  it('fetch support', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .get(`/support/${FirstMember}/${membership1}`)
        .send()
        .end((err, res) => {
            console.log("q6:", res.status, res.body)
            expect(res).to.have.status(200);
            done();
        });
    },200)
  });

  it('fetch support count by proposal', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .get(`/support/count/${membership1}`)
        .send()
        .end((err, res) => {
            console.log("q6:", res.status, res.body)
            expect(res).to.have.status(200);
            done();
        });
    },200)
  });


  it('Create pulse support', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/pulseSupport')
        .send({
            community_id: communityId,
            user_id: FirstMember,
        })
        .end((err, res) => {
            console.log("q42:", res.status, res.body)
            pulseId = res.body.pulse_id;
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });

  it('get pulse support count', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .get(`/pulseSupport/count/${pulseId}`)
        .send()
        .end((err, res) => {
            console.log("q42:", res.status, res.body)
            expect(res).to.have.status(200);
            done();
        });
    },200)
  });

  it('Create Vote 1', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/vote')
        .send({
            user_id: FirstMember,
            proposal_id: membership1,
        })
        .end((err, res) => {
            console.log("q4:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });
  it('Create support', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/support')
        .send({
            user_id: FirstMember,
            proposal_id: changeVariable1,
            support: 1,
        })
        .end((err, res) => {
            console.log("q4:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });
/*
  it('Delete pulse support', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .delete(`/pulseSupport/${communityId}/${AnotherMember1}`)
        .send()
        .end((err, res) => {
            console.log("q42:", res.status, res.body)
            expect(res).to.have.status(200);
            done();
        });
    },200)
  });
*/
  it('Create pulse support', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/pulseSupport')
        .send({
            community_id: communityId,
            user_id: FirstMember,
        })
        .end((err, res) => {
            console.log("q42:", res.status, res.body)
            pulseId = res.body.pulse_id;
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });

});

