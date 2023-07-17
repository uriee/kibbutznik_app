
import { transfer, getBalance } from '../utils/transfer.js'; 
import createLocalClient from '../utils/astraDB.js';
import Proposals from './proposals.js';
const express = require('express');
const Users = require('../modules/users.js');
const uuid = require('uuid');

import { IncrementStatus, create as createPulse } from './pulses.js';


class Communities {
    static async findById(communityId) {
        const astraClient = await createLocalClient();
        const query = 'SELECT * FROM Communities WHERE community_id = ?';
        const params = [communityId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async create(parent_community_id, name) {
        const astraClient = await createLocalClient();

        // Generate a new UUID for the community_id
        const community_id = uuid.v4();
        
        const query = 'INSERT INTO Communities (community_id, parent_community_id, status) VALUES (?, ?, ?)';
        const params = [community_id, parent_community_id, 1];
        await astraClient.execute(query, params);

        await copyVariables(community_id);

        await setName(community_id, name);

        return community_id;
    }

    static async endAction(communityId) {
        const astraClient = await createLocalClient();
        const query = 'UPDATE Communities SET status = 2 WHERE community_id = ?';
        const params = [ communityId ];
        await astraClient.execute(query, params);
    }

    
    static async getParentsTree(communityId) {
        let community = await this.findById(communityId);
        let parentsTree = [];

        while (community.parent_community_id != 0) {
            community = await this.findById(community.parent_community_id);
            parentsTree.push(community);
        }

        return parentsTree;
    }

    static async getChildrenTree(communityId) {
        const astraClient = await createLocalClient();
        const query = 'SELECT * FROM Communities WHERE parent_community_id = ?';
        const params = [communityId];
        const result = await astraClient.execute(query, params);

        const children = result.rows;
        for (let child of children) {
            child.children = await this.getChildrenTree(child.community_id);
        }

        return children;
    }

    static async isParentOf(parentCommunityId, childCommunityId) {
        let community = await this.findById(childCommunityId);

        while (community.parent_community_id != 0) {
            if (community.parent_community_id === parentCommunityId) return true;
            community = await this.findById(community.parent_community_id);
        }

        return false;
    }

    static async isChildOf(childCommunityId, parentCommunityId) {
        return await this.isParentOf(parentCommunityId, childCommunityId);
    }

    static async getVariables(communityId) {
        const astraClient = await createLocalClient();
        const query = 'SELECT * FROM Variables WHERE community_id = ?';
        const params = [communityId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async getStatements(communityId) {
        const astraClient = await createLocalClient();
        const query = 'SELECT * FROM Statements WHERE community_id = ?';
        const params = [communityId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async getMembers(communityId) {
        const astraClient = await createLocalClient();
        const query = 'SELECT * FROM Members WHERE community_id = ?';
        const params = [communityId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async getProposals(communityId) {
        const astraClient = await createLocalClient();
        const query = 'SELECT * FROM Proposals WHERE community_id = ?';
        const params = [communityId];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async setName(community_id, new_name) {
        if (!community_id || !new_name) {
            return null;
        }
    
        const astraClient = await createLocalClient();
    
        // Update the name variable for the given community
        const setNameQuery = 'UPDATE Variables SET variable_value = ? WHERE community_id = ? AND variable_type = ?';
        const params = [new_name, community_id, 'Name'];
        await astraClient.execute(setNameQuery, params);
    
        return 'Name successfully updated!';
    }

    static async copyVariables(community_id) {
        if (!community_id) {
            return null;
        }
    
        const astraClient = await createLocalClient();
    
        // Fetch all the default variable values
        const defaultVariableValuesQuery = 'SELECT * FROM Default_Variable_Values';
        const defaultVariableValuesResult = await astraClient.execute(defaultVariableValuesQuery);
    
        // Copy each default variable value to Variables table
        for (let defaultVariableValue of defaultVariableValuesResult.rows) {
            const variablesInsertQuery = 'INSERT INTO Variables (community_id, variable_id, variable_type, variable_value, variable_desc) VALUES (?, ?, ?, ?, ?)';
            const params = [community_id, defaultVariableValue.variable_id, defaultVariableValue.variable_type, defaultVariableValue.variable_default_value, defaultVariableValue.variable_desc];
            await astraClient.execute(variablesInsertQuery, params);
        }
    
        return 'Variables successfully copied!';
    }
    
    static async funding(from_community_id, to_community_id, amount) {
        const astraClient = await createLocalClient();
        
        // Fetch wallet addresses for both communities
        const from_query = 'SELECT wallet_address FROM Communities WHERE community_id = ?';
        const from_params = [from_community_id];
        const from_result = await astraClient.execute(from_query, from_params);
        const from_wallet_address = from_result.rows[0].wallet_address;

        const to_query = 'SELECT wallet_address FROM Communities WHERE community_id = ?';
        const to_params = [to_community_id];
        const to_result = await astraClient.execute(to_query, to_params);
        const to_wallet_address = to_result.rows[0].wallet_address;

        // Transfer funds from from_wallet_address to to_wallet_address
        const transferResult = await transfer(from_wallet_address, to_wallet_address, amount);

        return transferResult;
    }

    static async getCommunityBalance(community_id) {
        const astraClient = await createLocalClient();
        
        // Fetch wallet address for the community
        const query = 'SELECT wallet_address FROM Communities WHERE community_id = ?';
        const params = [community_id];
        const result = await astraClient.execute(query, params);
        const wallet_address = result.rows[0].wallet_address;

        // Get the balance of the community's wallet
        const balance = await getBalance(wallet_address);

        return balance;
    }

    static async pay(community_id, to_wallet_address, amount) {
        const astraClient = await createLocalClient();
        
        // Fetch wallet private key for the community
        const query = 'SELECT wallet_address FROM Communities WHERE community_id = ?';
        const params = [community_id];
        const result = await astraClient.execute(query, params);
        const fromPrivateKey = result.rows[0].wallet_address;

        // Transfer funds from the community's wallet to the recipient's wallet
        const transferResult = await transfer(fromPrivateKey, to_wallet_address, amount);

        return transferResult;
    }


    static async updateSupport(community_id) {
        if (!community_id) {
            return null;
        }
    
        const astraClient = await createLocalClient();

        // Fetch all 'OutThere' proposals of the community
        const outThereProposalsQuery = 'SELECT proposal_id FROM Proposals WHERE community_id = ? AND proposal_status = ?';
        const outThereProposalsParams = [community_id, 'OutThere'];
        const outThereProposals = await astraClient.execute(outThereProposalsQuery, outThereProposalsParams);

        // For each 'OutThere' proposal, count the support and update the proposal_support field
        for (let proposal of outThereProposals.rows) {
            const proposalId = proposal.proposal_id;

            const supportCountQuery = 'SELECT COUNT(*) as count FROM Support WHERE proposal_id = ? AND support = 1';
            const supportCountParams = [proposalId];
            const result = await astraClient.execute(supportCountQuery, supportCountParams);

            const supportCount = result.rows[0].count;

            const updateSupportQuery = 'UPDATE Proposals SET proposal_support = ? WHERE proposal_id = ?';
            const updateSupportParams = [supportCount, proposalId];
            await astraClient.execute(updateSupportQuery, updateSupportParams);
        }
    }

    static async incrementAge(community_id) {
        const astraClient = await createLocalClient();
        
        const query = 'UPDATE Proposals SET age = age + 1 WHERE community_id = ? AND proposal_status = ?';
        const params = [community_id, 'OutThere'];
        
        await astraClient.execute(query, params);
    }

    static async handleOnTheAirProposals(community_id) {
        try {

            const pulseQuery = 'SELECT pulse_id FROM Pulse WHERE community_id = ? AND status = ?';
            const activePulse = await astraClient.execute(pulseQuery, [community_id, 1]);

            const proposals = await this.AcceptedOrRejected(community_id, activePulse);
            
            for (const [proposal_id, isAccepted] of Object.entries(proposals)) {
                if (isAccepted) {
                    await Proposals.executeProposal(proposal_id);
                    await Proposals.UpdateStatus(proposal_id, true);  
                } else {
                    await Proposals.UpdateStatus(proposal_id, false); 
                }
            }
            IncrementStatus(activePulse)
        } catch (error) {
            console.error(`Error handling proposals: ${error.message}`);
        }
    }

    static async AcceptedOrRejected(community_id) {
        if (!community_id) {
            return null;
        }
    
        const astraClient = await createLocalClient();
    
        pulse_id = pulseIdByStatus(community_id, 1)
    
        // Fetch all the proposals that are linked to the pulse_id
        const proposalQuery = 'SELECT proposal_id, proposal_type FROM Proposals WHERE community_id = ? AND pulse_id = ?';
        const proposals = await astraClient.execute(proposalQuery, [community_id, pulse_id]);
    
        // Fetch the community's member_count
        const communityQuery = 'SELECT members_count FROM Communities WHERE community_id = ?';
        const community = await astraClient.execute(communityQuery, [community_id]);
        const member_count = community.rows[0].members_count;
    
        const results = {};
        for (let proposal of proposals.rows) {
            const votes = await countVotes(proposal.proposal_id);
    
            // Fetch the variable_value where Variable.variable_type == Proposals.proposal_type
            const variableQuery = 'SELECT variable_value FROM Variables WHERE community_id = ? AND variable_type = ?';
            const variable = await astraClient.execute(variableQuery, [community_id, proposal.proposal_type]);
            const variable_value = variable.rows[0].variable_value;
    
            // Check if the proposal is accepted or rejected
            results[proposal.proposal_id] = (votes[1] / member_count * 100 > variable_value);
        }
    
        return results;
    }

    static async OutThere_2_OnTheAir(community_id) {
        if (!community_id) {
            return null;
        }
    
        const astraClient = await createLocalClient();
    
        // Fetch the community's 'Next' pulse
        const nextPulse = pulseIdByStatus(community_id, 0)
        if (!nextPulse.rows.length) {
            throw new Error('No next pulse found for this community.');
        }
    
        // Fetch PulseSupport and MaxAge variable values
        const variableQuery = 'SELECT variable_value FROM Variables WHERE community_id = ? AND variable_type IN (?, ?)';
        const variables = await astraClient.execute(variableQuery, [community_id, 'PulseSupport', 'MaxAge']);
        const pulseSupport = variables.rows.find(variable => variable.variable_type === 'PulseSupport').variable_value;
        const maxAge = variables.rows.find(variable => variable.variable_type === 'MaxAge').variable_value;
    
        // Fetch the community's member_count
        const communityQuery = 'SELECT members_count FROM Communities WHERE community_id = ?';
        const community = await astraClient.execute(communityQuery, [community_id]);
        const member_count = community.rows[0].members_count;
    
        // Update community support
        await this.updateSupport(community_id);
    
        // Fetch community proposals of status 'OutThere' and update their status
        const outThereProposalsQuery = 'SELECT * FROM Proposals WHERE community_id = ? AND proposal_status = ?';
        const outThereProposals = await astraClient.execute(outThereProposalsQuery, [community_id, 'OutThere']);
        for (let proposal of outThereProposals.rows) {
            const proposalSupport = proposal.proposal_support;
            if (proposalSupport / member_count * 100 > pulseSupport) {
                await Proposals.UpdateStatus(proposal.proposal_id, true);
            } else {
                if (maxAge > proposal.age) {
                    await Proposals.UpdateStatus(proposal.proposal_id, false);
                }
            }
        }
        IncrementStatus(nextPulse)
        createPulse(community_id)
    }

    static async pulse(community_id){
        this.handleOnTheAirProposals(community_id)
        this.OutThere_2_OnTheAir(community_id)
    }

}

export default Communities;
