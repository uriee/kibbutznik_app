const chai = require('chai');
const chaiHttp = require('chai-http');
const { v4: uuidV4 } = require('uuid');
const server = require('../../server'); // Adjust path as needed

chai.use(chaiHttp);
const expect = chai.expect;

describe('API Tests', () => {
  let FirstMember, AnotherMember1, AnotherMember2;
  let membership1, membership2, changeVariable1, newStatement1, removeStatement1 , replaceStatement1 ,newStatement2, newAction1
  let newActionMember1, newActionMember2, endAction1
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

  it('Create a proposal to remove a statement', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/proposals')
        .send({
            community_id: communityId,
            val_uuid: newStatement1,
            user_id: FirstMember,
            proposal_type: 'RemoveStatement',
            proposal_text: 'Remove statement now!!',
        })
        .end((err, res) => {
            removeStatement1 = res.body.proposal_id
            console.log("q5:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });


  it('should update proposal status', (done) => {
    setTimeout(() => {
        chai.request(server)
            .put(`/proposals/status`)
            .send({ 'direction': true, 'proposal_id': membership1 })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    }, 200);
});

  it('should find a proposal by id', (done) => {
      setTimeout(() => {
          chai.request(server)
              .get(`/proposals/${membership1}`)
              .end((err, res) => {
                  expect(res).to.have.status(200);
                  done();
              });
      }, 200);
  });

  // Testing Get all proposals route
  it('should get all proposals', (done) => {
      setTimeout(() => {
          chai.request(server)
              .get(`/proposals/${communityId}/0/0`)
              .end((err, res) => {
                  console.log(res.body)
                  expect(res).to.have.status(200);
                  done();
              });
      }, 200);
  });

  it('should find proposals by pulse', (done) => {
      setTimeout(() => {
          chai.request(server)
              .get(`/proposals/pulse/${membership1}`)
              .end((err, res) => {
                  expect(res).to.have.status(200);
                  done();
              });
      }, 200);
  });

  it('should execute a Membership proposal', (done) => {
      setTimeout(() => {
          chai.request(server)
              .post(`/proposals/execute/${membership1}`)
              .end((err, res) => {
                  expect(res).to.have.status(200);
                  done();
              });
      }, 200);
  });

  it('should execute a new Statement proposal', (done) => {
    setTimeout(() => {
        chai.request(server)
            .post(`/proposals/execute/${newStatement1}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    }, 200);
  });
  it('should execute a new Statement proposal', (done) => {
    setTimeout(() => {
        chai.request(server)
            .post(`/proposals/execute/${newStatement2}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    }, 200);
  });

  it('Create a proposal to remove a statement', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/proposals')
        .send({
            community_id: communityId,
            user_id: FirstMember,
            val_uuid: newStatement1, 
            proposal_type: 'RemoveStatement',
            proposal_text: 'remove it!!',
        })
        .end((err, res) => {
            removeStatement1 = res.body.proposal_id
            console.log("q4:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    }, 200)
  });

  it('should execute a remove Statement proposal', (done) => {
    setTimeout(() => {
        chai.request(server)
            .post(`/proposals/execute/${removeStatement1}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    }, 200);
  });


  it('Create a proposal to replace a statement', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/proposals')
        .send({
            community_id: communityId,
            user_id: FirstMember,
            val_uuid: newStatement2, 
            val_text: "IM replaciiing YOuuu!!!!!",
            proposal_type: 'ReplaceStatement',
            proposal_text: 'IM replaciiing YOuuu??????',
        })
        .end((err, res) => {
            replaceStatement1 = res.body.proposal_id
            console.log("q4:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });

  it('should execute a replace Statement proposal', (done) => {
    setTimeout(() => {
        console.log("replaceStatement1", replaceStatement1)
        chai.request(server)
            .post(`/proposals/execute/${replaceStatement1}`)
            .end((err, res) => {
                console.log("RES:",res.body)
                expect(res).to.have.status(200);
                done();
            });
    }, 200);
  });

  it('should execute a change variable proposal', (done) => {
    setTimeout(() => {
        chai.request(server)
            .post(`/proposals/execute/${changeVariable1}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    }, 200);
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
            console.log("q7:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });

  it('should execute a new action proposal', (done) => {
    setTimeout(() => {
        chai.request(server)
            .post(`/proposals/execute/${newAction1}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    }, 200);
  });

  it('Create a proposal for a new action', (done) => {
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

  it('should execute a new action member proposal', (done) => {
    setTimeout(() => {
        chai.request(server)
            .post(`/proposals/execute/${newActionMember1}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    }, 200);
  });

  it('Create a proposal for a new action', (done) => {
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

  it('should execute a new action member proposal', (done) => {
    setTimeout(() => {
        chai.request(server)
            .post(`/proposals/execute/${newActionMember2}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    }, 200);
  });

  it('Create a proposal for to end action', (done) => {
    setTimeout(() => { 
    chai.request(server)
        .post('/proposals')
        .send({
            community_id: newAction1, 
            user_id: AnotherMember2,
            proposal_type: 'EndAction',
            proposal_text: 'End it!!',
        })
        .end((err, res) => {
            endAction1 = res.body.proposal_id
            console.log("q9:", res.status, res.body)
            expect(res).to.have.status(201);
            done();
        });
    },200)
  });

  it('should execute a new action member proposal', (done) => {
    setTimeout(() => {
        chai.request(server)
            .post(`/proposals/execute/${endAction1}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    }, 200);
  });

});

