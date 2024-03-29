//const { transfer, getBalance } = require('../utils/transfer.js');
const DBClient = require('../utils/localDB.js');
const { PulseIncrementStatus, create: createPulse } = require('./pulses.js');
const { executeProposal, UpdateStatus} = require('./proposals.js');
const express = require('express');
const Users = require('../modules/users.js');
const Pulses = require('../modules/pulses.js');
const Proposals = require('../modules/proposals.js');
const Actions = require('../modules/actions.js');
const uuid = require('uuid');

class Communities {

    static async findById(communityId) {
        const db = DBClient.getInstance();
        const query = 'SELECT * FROM Communities WHERE community_id = ?';
        const params = [communityId];
        const result = await db.execute(query, params);
        // Return only the first community object or null if no community found
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    static async createWithUser(parent_community_id, name, user_id) {
        const db = DBClient.getInstance();

        // Generate a new UUID for the community_id
        const community_id = uuid.v4();

        // Create a new community
        const communityQuery = 'INSERT INTO Communities (community_id, parent_community_id, status) VALUES (?, ?, ?)';
        const communityParams = [community_id, parent_community_id, 1];
        await db.execute(communityQuery, communityParams, { hints : ['uuid','uuid', 'int']});
        console.log('Community created');

        await this.copyVariables(community_id);

        await this.setName(community_id, name);

        // Add the user as a member in the new community
        const memberQuery = 'INSERT INTO Members (community_id, user_id, status, seniority) VALUES (?, ?, ?, ?)';
        const memberParams = [community_id, user_id, 1, 0]; 
        await db.execute(memberQuery, memberParams, { hints : ['uuid', 'uuid', 'int', 'int']});

        const counterQuery = `UPDATE member_counter SET member_count = member_count + 1 WHERE community_id = ${community_id}`;
        console.log('xxx', counterQuery);
        try {
            await db.execute(counterQuery);
        }catch (err) {
            console.Console.error("p",err)
        }

        await createPulse(community_id)
        console.log('Pulse created');

        return community_id;
    }
    
    static async getParentsTree(communityId) {
        let community = await this.findById(communityId);
        let parentsTree = [];
        const nilUuid = '00000000-0000-0000-0000-000000000000';
        while (community.parent_community_id != nilUuid) {
            community = await this.findById(community.parent_community_id);
            parentsTree.push(community);
        }

        return parentsTree;
    }

    static async getChildrenTree(communityId) {
        const db = DBClient.getInstance();
        const query = 'SELECT * FROM Communities WHERE parent_community_id = ? ALLOW FILTERING';

        const params = [communityId];
        const result = await db.execute(query, params);

        const children = result.rows;
        for (let child of children) {
            child.children = await this.getChildrenTree(child.community_id);
            console.log("child:",child)
        }

        return children;
    }

    static async isParentOf(parentCommunityId, childCommunityId) {
        let community = await this.findById(childCommunityId);
        const nilUuid = '00000000-0000-0000-0000-000000000000';
        while (community.parent_community_id != nilUuid) {
            if (community.parent_community_id == parentCommunityId) return true;
            community = await this.findById(community.parent_community_id);
        }

        return false;
    }


    static async isChildOf(childCommunityId, parentCommunityId) {
        console.log("hildCommunityId, parentCommunityId:", childCommunityId, parentCommunityId)
        return await this.isParentOf(parentCommunityId, childCommunityId);
    }

    static async getVariables(communityId) {
        const db = DBClient.getInstance();
        const query = 'SELECT * FROM Variables WHERE community_id = ?';
        const params = [communityId];
        const result = await db.execute(query, params);
        return result.rows;
    }

    static async getStatements(communityId) {
        const db = DBClient.getInstance();
        const query = 'SELECT * FROM Statements WHERE community_id = ?';
        const params = [communityId];
        const result = await db.execute(query, params);
        return result.rows;
    }

    static async getMembers(communityId) {
        const db = DBClient.getInstance();
        const query = 'SELECT * FROM Members WHERE community_id = ?';
        const params = [communityId];
        const result = await db.execute(query, params);
        return result.rows;
    }

    static async getProposals(communityId) {
        const db = DBClient.getInstance();
        const query = 'SELECT * FROM Proposals WHERE community_id = ?';
        const params = [communityId];
        const result = await db.execute(query, params);
        return result.rows;
    }

    static async setName(community_id, new_name) {
        if (!community_id || !new_name) {
            return null;
        }
    
        const db = DBClient.getInstance();
    
        // Update the name variable for the given community
        const setNameQuery = 'UPDATE Variables SET variable_value = ? WHERE community_id = ? AND variable_type = ?';
        const params = [new_name, community_id, 'Name'];
        await db.execute(setNameQuery, params);
    
        return 'Name successfully updated!';
    }

    static async copyVariables(community_id) {
        if (!community_id) {
            return null;
        }
    
        const db = DBClient.getInstance();
    
        // Fetch all the default variable values
        const defaultVariableValuesQuery = 'SELECT * FROM Default_Variable_Values';
        const defaultVariableValuesResult = await db.execute(defaultVariableValuesQuery);
        
        // Copy each default variable value to Variables table
        for (let defaultVariableValue of defaultVariableValuesResult.rows) {
            console.log(defaultVariableValue)
            const variable_id = await uuid.v4();
            const variablesInsertQuery = 'INSERT INTO Variables (community_id, variable_id, variable_type, variable_value, variable_desc) VALUES (?, ?, ?, ?, ?)';
            const params = [community_id, variable_id, defaultVariableValue.variable_type, defaultVariableValue.variable_default_value, defaultVariableValue.variable_desc];
            console.log('params: ', params)
            await db.execute(variablesInsertQuery, params);
        }
    
        return 'Variables successfully copied!';
    }
    /*
    static async funding(from_community_id, to_community_id, amount) {
        const db = DBClient.getInstance();
        
        // Fetch wallet addresses for both communities
        const from_query = 'SELECT wallet_address FROM Communities WHERE community_id = ?';
        const from_params = [from_community_id];
        const from_result = await db.execute(from_query, from_params);
        const from_wallet_address = from_result.rows[0].wallet_address;

        const to_query = 'SELECT wallet_address FROM Communities WHERE community_id = ?';
        const to_params = [to_community_id];
        const to_result = await db.execute(to_query, to_params);
        const to_wallet_address = to_result.rows[0].wallet_address;

        // Transfer funds from from_wallet_address to to_wallet_address
        const transferResult = await transfer(from_wallet_address, to_wallet_address, amount);

        return transferResult;
    }
    */

    static async getCommunityBalance(community_id) {
        const db = DBClient.getInstance();
        
        // Fetch wallet address for the community
        const query = 'SELECT wallet_address FROM Communities WHERE community_id = ?';
        const params = [community_id];
        const result = await db.execute(query, params);
        const wallet_address = result.rows[0].wallet_address;

        // Get the balance of the community's wallet
        const balance = await getBalance(wallet_address);

        return balance;
    }
    /*
    static async pay(community_id, to_wallet_address, amount) {
        const db = DBClient.getInstance();
        
        // Fetch wallet private key for the community
        const query = 'SELECT wallet_address FROM Communities WHERE community_id = ?';
        const params = [community_id];
        const result = await db.execute(query, params);
        const fromPrivateKey = result.rows[0].wallet_address;

        // Transfer funds from the community's wallet to the recipient's wallet
        const transferResult = await transfer(fromPrivateKey, to_wallet_address, amount);

        return transferResult;
    }
    */


    static async incrementAge(community_id) {
        const db = DBClient.getInstance();
        
        const query = 'UPDATE Proposals SET age = age + 1 WHERE community_id = ? AND proposal_status = ?';
        const params = [community_id, 'OutThere'];
        
        await db.execute(query, params);
    }

    static async handleOnTheAirProposals(community_id, variables) {
        try {
            console.log("QQQQ")
            const activePulse = await Pulses.pulseIdByStatus(community_id, 1)
            console.log("QQQQ",activePulse)
            if (!activePulse) {
                return 0
            }
            const proposals = await this.AcceptedOrRejected(community_id, activePulse, variables);

            console.log("______________21", proposals)
            
            for (const [proposal_id, isAccepted] of Object.entries(proposals)) {
                if (isAccepted) {
                    console.log("1234567890",Actions.create ,proposal_id)
                    let xxx = await executeProposal(proposal_id, Actions.create, Actions.endAction);
                    console.log("12345678901")
                    xxx = await UpdateStatus(proposal_id, true);  
                    console.log("12345678902")
                } else {
                    await UpdateStatus(proposal_id, false); 
                }
            }
            PulseIncrementStatus(activePulse, community_id, 1)
        } catch (error) {
            console.error(`Error handling proposals: ${error.message}`);
            return 2
        }
        return 1
    }

    static async AcceptedOrRejected(community_id, pulse_id, variables) {
        if (!community_id) {
            return null;
        }
    
        const db = DBClient.getInstance();
    
        pulse_id = await Pulses.pulseIdByStatus(community_id, 1)
        console.log(pulse_id)
        if (!pulse_id) {
            return false
        }
    
        // Fetch all the proposals that are linked to the pulse_id
        const proposalQuery = 'SELECT proposal_id, proposal_type FROM Proposals WHERE community_id = ? AND pulse_id = ?';
        const proposals = await db.execute(proposalQuery, [community_id, pulse_id]);
        console.log("_____84", proposals,pulse_id);
        // Fetch the community's member_count
        const communityQuery = 'SELECT members_count FROM Communities WHERE community_id = ?';
        const community = await db.execute(communityQuery, [community_id]);
        const member_count = community.rows[0].members_count;
    
        const results = {};
        for (let proposal of proposals.rows) {

            const variable_value = variables[proposal.proposal_type];

            const counters_r = await db.execute(`SELECT * FROM proposal_counters WHERE proposal_id = ${proposal.proposal_id}`)
            let votes = 0;
            console.log("-_____65",counters_r.rows[0].proposal_vote == null)
            if (counters_r.rows[0].proposal_vote != null) {
                votes = counters_r.rows[0].proposal_vote.low
            }
            console.log("______97", votes, variable_value,votes / member_count * 100 >= variable_value)
            // Check if the proposal is accepted or rejected
            results[proposal.proposal_id] = (votes / member_count * 100 > variable_value);
        }
    
        return results;
    }

    static async fetchCommunityVariables(community_id, variable_types=[]) {
        const resultMap = {};
        let query = 'SELECT * FROM Variables WHERE community_id = ?';
        let params = [community_id];
        const db = DBClient.getInstance();
      
        if (variable_types.length > 0) {
          query += ' AND variable_type IN ?';
          params.push(variable_types);
        }
      
        try {
          const result = await db.execute(query, params, { prepare: true });
          for (const row of result.rows) {
            resultMap[row.variable_type] = row.variable_value;
          }
        } catch (err) {
          console.error('Failed to fetch community variables:', err);
        }
      
        return resultMap;
      }

    static async OutThere_2_OnTheAir(community_id, variables) {
        if (!community_id) {
            return null;
        }
    
        const db = DBClient.getInstance();
    
        // Fetch the community's 'Next' pulse
        const nextPulse_id = await Pulses.pulseIdByStatus(community_id, 0)
        console.log("_________________________", nextPulse_id)
        if (!nextPulse_id) {
            throw new Error('No next pulse found for this community.');
        }
    
        // Fetch PulseSupport and MaxAge variable values
        const variableQuery = `SELECT variable_value FROM Variables WHERE community_id = ? AND variable_type = ?`;
        const maxAge_q = await db.execute(variableQuery, [community_id, 'MaxAge']);
        const maxAge = maxAge_q.rows[0].variable_value;
    
        // Fetch the community's member_count
        const communityQuery = 'SELECT member_count FROM member_counter WHERE community_id = ?';
        const community = await db.execute(communityQuery, [community_id]);
        const member_count = community.rows[0].member_count;
    
        // Fetch community proposals of status 'OutThere' and update their status
        const outThereProposalsQuery = 'SELECT * FROM Proposals WHERE community_id = ? AND proposal_status = ?';
        const outThereProposals = await db.execute(outThereProposalsQuery, [community_id, 'OutThere']);
        for (let proposal of outThereProposals.rows) {
            const query_u = `update proposal_counters SET age = age + 1 WHERE proposal_id = ${proposal.proposal_id}`;
            await db.execute(query_u);
            const query = `select * from proposal_counters WHERE proposal_id = ${proposal.proposal_id}`;
            const proposal_counters = await db.execute(query, [], { traceQuery: true });
            console.log("____________",proposal_counters.info)
            let proposalSupport = null;
            let proposalAge = 0;
            if (proposal_counters.rows) {
                proposalSupport = proposal_counters.rows[0].proposal_support;
                proposalAge = proposal_counters.rows[0].age;
                console.log("____________54",proposal_counters.rows[0],proposal_counters.rows);
                console.log("____________55",proposalAge,maxAge);
            }
            console.log("proFUCKIT",proposalSupport && proposal.proposal_type in variables, proposal)
            if (proposalSupport && proposal.proposal_type in variables) {
                console.log("____________12",proposalSupport.toInt(), member_count.toInt()/ 100.0 * variables[proposal.proposal_type])
                const NeddedSupport =  member_count.toInt()/ 100.0 * variables[proposal.proposal_type];
                console.log(proposalSupport.toInt() >= NeddedSupport, proposalSupport >= NeddedSupport )
                if (proposalSupport >= NeddedSupport) {
                    await Proposals.UpdateStatus(proposal.proposal_id, true, nextPulse_id);
                }       
            }else{
                console.log("FuckIt");
            }
            if (proposalAge > maxAge) {
                await Proposals.UpdateStatus(proposal.proposal_id, false);
            }

        }
        await PulseIncrementStatus(nextPulse_id, community_id, 0)
        const xxx = await createPulse(community_id)
        return true
    }

    static async handle_members(community_id) {
        const db = DBClient.getInstance();
        let member_count = 0;
    
        try {
          // Increment seniority for all members
          const getMembersQuery = `SELECT user_id FROM Members WHERE community_id = ?`;
          const membersResult = await db.execute(getMembersQuery, [community_id], { prepare: true });
          const updateSeniorityQuery = `UPDATE seniority_counter SET seniority = seniority + 1 WHERE community_id = ? AND user_id = ?`;
          
          for (const row of membersResult.rows) {
            await db.execute(updateSeniorityQuery, [community_id, row.user_id], { prepare: true });
            member_count++;
          }
    
          // Update the community members_count
          const updateCommunityQuery = `UPDATE Communities SET members_count = ? WHERE community_id = ?`;
          await db.execute(updateCommunityQuery, [member_count, community_id], { prepare: true });
    
          return [true, member_count];
    
        } catch (err) {
          console.error("Error in calc_membership:", err);
          return [false, err];
        }
      }

    static async pulse(community_id){
        const variables = await Communities.fetchCommunityVariables(community_id);
        console.log("_____99",variables)
        const xx1 = await this.handleOnTheAirProposals(community_id, variables)
        const xx2 = await this.OutThere_2_OnTheAir(community_id,variables)
        const [success, result] = await this.handle_members(community_id);
        if (success) {
          console.log(`handle_members succeeded with member_count = ${result}`);
        } else {
          console.log(`handle_members failed with error: ${result}`);
        }
        console.log("OOOO",xx1,xx2)
    }

}

module.exports = Communities;
