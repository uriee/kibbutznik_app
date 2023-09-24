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

  it('Create a proposal for a new action', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/proposals')
        .send({
            community_id: communityId, 
            user_id: AnotherMember1,
            val_text: "newCom",
            proposal_type: 'AddAction',
            proposal_text: 'simple proposal text',
        })
        .end((err, res) => {
            newAction1 = res.body.proposal_id
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });


  //------------------------------------------------------------------------

  it('Create support 11', (done) => {
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

  it('Create support 12', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/support')
        .send({
            user_id: FirstMember,
            proposal_id: newAction1,
            support: 1,
        })
        .end((err, res) => {
            console.log("q4:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });

  it('Create support 13', (done) => {
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

  it('fetch support 14', (done) => {
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
  it('Create Vote 3', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/vote')
        .send({
            user_id: FirstMember,
            proposal_id: newAction1,
        })
        .end((err, res) => {
            console.log("q4:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });
  it('Create Vote 2', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/vote')
        .send({
            user_id: FirstMember,
            proposal_id: membership2,
        })
        .end((err, res) => {
            console.log("q41:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });

  it('Create support 21', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/support')
        .send({
            user_id: FirstMember,
            proposal_id: newStatement1,
            support: 1,
        })
        .end((err, res) => {
            console.log("q4:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });

  it('Create support 22', (done) => {
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
it('Create a proposal for a new action member', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/proposals')
        .send({
            community_id: communityId, 
            user_id: AnotherMember2,
            val_uuid: newAction1,
            proposal_type: 'JoinAction',
            proposal_text: 'I want to Join!!',
        })
        .end((err, res) => {
            newActionMember2 = res.body.proposal_id
            console.log("q8:", res.status, res.body)
            expect(res).to.have.status(201);
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

  it('Create support 31', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/support')
        .send({
            user_id: AnotherMember1,
            proposal_id: newActionMember2,
            support: 1,
        })
        .end((err, res) => {
            console.log("q48:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });

  it('Create a proposal for a new action member', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/proposals')
        .send({
            community_id: communityId, 
            user_id: AnotherMember1,
            val_uuid: newAction1,
            proposal_type: 'JoinAction',
            proposal_text: 'I want to Join!!',
        })
        .end((err, res) => {
            newActionMember1 = res.body.proposal_id
            console.log("q8:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });


  it('Create support 32', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/support')
        .send({
            user_id: AnotherMember2,
            proposal_id: newActionMember1,
            support: 1,
        })
        .end((err, res) => {
            console.log("q48:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });


  it('Create support 33', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/support')
        .send({
            user_id: AnotherMember2,
            proposal_id: newActionMember2,
            support: 1,
        })
        .end((err, res) => {
            console.log("q48:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });
  it('Create support 34', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/support')
        .send({
            user_id: FirstMember,
            proposal_id: newActionMember2,
            support: 1,
        })
        .end((err, res) => {
            console.log("q4834:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });
  it('Create support 35', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/support')
        .send({
            user_id: AnotherMember1,
            proposal_id: newActionMember1,
            support: 1,
        })
        .end((err, res) => {
            console.log("q48:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });


  it('Create support 36', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/support')
        .send({
            user_id: FirstMember,
            proposal_id: newActionMember1,
            support: 1,
        })
        .end((err, res) => {
            console.log("q4836:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });

  it('Create support 37', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/support')
        .send({
            user_id: AnotherMember1,
            proposal_id: newStatement1,
            support: 1,
        })
        .end((err, res) => {
            console.log("q48:", res.status, res.body)
            expect(res).to.have.status(201);
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

  it('Create Vote 1', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/vote')
        .send({
            user_id: FirstMember,
            proposal_id: newActionMember1,
        })
        .end((err, res) => {
            console.log("q4:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });

  it('Create Vote 1', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/vote')
        .send({
            user_id: AnotherMember1,
            proposal_id: newActionMember1,
        })
        .end((err, res) => {
            console.log("q4:", res.status, res.body)
            expect(res).to.have.status(201);
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
  it('Create pulse support', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/pulseSupport')
        .send({
            community_id: communityId,
            user_id: AnotherMember1,
        })
        .end((err, res) => {
            console.log("q42:", res.status, res.body)
            pulseId = res.body.pulse_id;
            expect(res).to.have.status(201);
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
            user_id: AnotherMember2,
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


