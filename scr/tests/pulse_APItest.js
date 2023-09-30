const chai = require('chai');
const chaiHttp = require('chai-http');
const { v4: uuidV4 } = require('uuid');
const server = require('../../server'); // Adjust path as needed

chai.use(chaiHttp);
const expect = chai.expect;

const makeRequest = (method, url, data, expectStatus) => {
    return new Promise((resolve, reject) => {
      chai.request(server)
        [method](url)
        .send(data)
        .end((err, res) => {
            
          console.log(`${method.toUpperCase()} ${url}`, res.body,err);
          expect(res).to.have.status(expectStatus);
          resolve(res.body);
        });
    });
  };

const createProposal = async (community_id, user_id, proposal_type, proposal_text, val_text, val_uuid) => {
  const data = { community_id, user_id, proposal_type, proposal_text}
  if (val_text) data.val_text = val_text
  if (val_uuid) data.val_uuid = val_uuid
  return await makeRequest('post', '/proposals', data, 201);
}; 


const createSupport = async (userId, proposalId, support) => {
    const data = { user_id: userId, proposal_id: proposalId, support };
    return await makeRequest('post', '/support', data, 201);
  };
  
const fetchSupport = async (userId, proposalId) => {
    return await makeRequest('get', `/support/${userId}/${proposalId}`, null, 200);
  };

const createUser = async (username) => {
    const data = { username };
    return await makeRequest('post', '/users', data, 201);
  };

const getSupportCount = async (proposalId) => {
    return await makeRequest('get', `/support/count/${proposalId}`, null, 200);
};

const createPulseSupport = async (communityId, userId) => {
    const data = { community_id: communityId, user_id: userId };
    return await makeRequest('post', '/pulseSupport', data, 201);
}

const deletePulseSupport = async (communityId, userId) => {
    const data = { community_id: communityId, user_id: userId };
    return await makeRequest('delete', '/pulseSupport', data, 201);
}

const getPulseSupportCount = async (pulseId) => {
    return await makeRequest('get', `/pulseSupport/count/${pulseId}`, null, 200);
};

const createVote = async (userId, proposalId) => {
    const data = { user_id: userId, proposal_id: proposalId };
    return await makeRequest('post', '/vote', data, 201);
  };

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('API Tests', () => {
  let FirstMember, AnotherMember1, AnotherMember2;
  let membership1, membership2, changeVariable1, newStatement1, removeStatement1 , replaceStatement1 ,newStatement2, newAction1
  let newActionMember1, newActionMember2, endAction1, pulseId
  let communityId;

  it('Create FirstMember user', async () => {
    const user = await createUser('FirstMember');
    FirstMember = user.user_id;
  });
  it('Create FirstMember user', async () => {
    const user = await createUser('FirstMember');
    AnotherMember1 = user.user_id;
  });
  it('Create FirstMember user', async () => {
    const user = await createUser('FirstMember');
    AnotherMember2 = user.user_id;
  });

  it('Create a new community with member called "TastyTest" using FirstMember', async () => {
    await wait(30);
    const newCommunity = {
      community_id: '00000000-0000-0000-0000-000000000000',
      name: 'TastyTest',
      user_id: FirstMember,
    };
    let nc = await makeRequest('post', '/communities/createWithUser', newCommunity, 201)
    communityId = nc.community_id;
  });
  
  it('Create 2 Membership proposals for AnotherMember_1 and AnotherMember_2', async () => {
    await wait(30);
    let m1 = await createProposal(communityId, AnotherMember1, 'Membership', 'Hey let me in. AnotherMember1')
    membership1 = m1.proposal_id;
    await wait(30);
    console.log("ZAS",m1)
    let m2 = await createProposal(communityId, AnotherMember2, 'Membership', 'Hey let me in. AnotherMember2')
    membership2 = m2.proposal_id;
  });


  it('Create a proposal to change the community variable', async () => {
    await wait(30);
    const proposal = await createProposal(communityId, FirstMember, 'ChangeVariable', 'MinCommittee', '217');
    changeVariable1 = proposal.proposal_id;
  });
  
  it('Create two proposals to add new statements', async () => {
    await wait(30);
    let proposal = await createProposal(communityId, FirstMember, 'AddStatement', 'Add a new statement for better clarity');
    newStatement1 = proposal.proposal_id;
  
    proposal = await createProposal(communityId, FirstMember, 'AddStatement', 'Add another new statement');
    newStatement2 = proposal.proposal_id;
  });
  
  it('Create a proposal for a new action', async () => {
    await wait(30);
    const proposal = await createProposal(communityId, AnotherMember1, 'AddAction', 'simple proposal text', 'newCom');
    newAction1 = proposal.proposal_id;
  });
  
  it('Create multiple supports', async () => {
    await wait(30);
    await createSupport(FirstMember, membership1, 1);
    await createSupport(FirstMember, newAction1, 1);
    await createSupport(FirstMember, membership2, 1);
  });
  
  it('Fetch supports', async () => {
    await wait(30);
    await fetchSupport(FirstMember, membership1);
    await getSupportCount(membership1);
  });
  
  it('fetch support count by proposal', async () => {
    await wait(30);
    await getSupportCount(membership1);
  });

  it('Create pulse support', async () => {
    await wait(30);
    const result = await createPulseSupport(communityId, FirstMember);
    pulseId = result.pulse_id;
  });

  it('get pulse support count', async () => {
    await wait(30);
    await getPulseSupportCount(pulseId);
  });

  it('Create Vote 1', async () => {
    await wait(30);
    await createVote(FirstMember, membership1);
    await createVote(FirstMember, membership2);
    await createVote(FirstMember, newAction1);
  });

  it('Create support 21', async () => {
    await wait(30);
    await createSupport(FirstMember, newStatement1, 1);
    await createSupport(FirstMember, changeVariable1, 1);
  });

  /*
  it('Delete pulse support', async () => {
    await wait(30);
    pulseId = (await deletePulseSupport(communityId, FirstMember)).pulse_id;
  });
  */
  it('Create pulse support', async () => {
    await wait(30);
    pulseId = (await createPulseSupport(communityId, FirstMember)).pulse_id;
  });
   
  it('Create a proposal for a new action member', async () => {
    await wait(30);
    newActionMember2 = (await createProposal(communityId, AnotherMember2, 'JoinAction', 'I want to Join!!', '', newAction1)).proposal_id;
  });
  
  it('Create a proposal for a new action member', async () => {
    await wait(30);
    newActionMember1 = (await createProposal(communityId, AnotherMember1, 'JoinAction', 'I want to Join!!', '', newAction1)).proposal_id;
  });
  
  it('Create support 32', async () => {
    await wait(30);
    await createSupport(AnotherMember2, newActionMember1, 1);
    await createSupport(AnotherMember2, newActionMember2, 1);
    await createSupport(FirstMember, newActionMember2, 1);
    await createSupport(AnotherMember1, newActionMember1, 1);
    await createSupport(FirstMember, newActionMember1, 1);
    await createSupport(AnotherMember1, newStatement1, 1);
  });
  
  it('Create pulse support 12', async () => {
    await wait(30);
    pulseId = (await createPulseSupport(communityId, FirstMember)).pulse_id;
    pulseId = (await createPulseSupport(communityId, AnotherMember1)).pulse_id;
    pulseId = (await createPulseSupport(communityId, AnotherMember2)).pulse_id;
  });

  it('Create Vote 13', async () => {
    await wait(30);
    await createVote(FirstMember, newActionMember1);
    await createVote(AnotherMember1, newActionMember1);
    await createVote(AnotherMember2, newActionMember1);
    await createVote(FirstMember, newActionMember2);
    await createVote(AnotherMember1, newActionMember2);
    await createVote(AnotherMember2, newActionMember2);
  });
  
  it('Create pulse support', async () => {
    await wait(30);
    pulseId = (await createPulseSupport(communityId, FirstMember)).pulse_id;
    pulseId = (await createPulseSupport(communityId, AnotherMember1)).pulse_id;
    pulseId = (await createPulseSupport(communityId, AnotherMember2)).pulse_id;
  });
  
});


