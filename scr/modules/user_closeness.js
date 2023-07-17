import createLocalClient from '../utils/astraDB.js';

class UserCloseness {
    static async insert(userId1, userId2, closenessScore) {
        const astraClient = await createLocalClient();
        const query = 'INSERT INTO Closeness_Records (user_id1, user_id2, closeness_score, last_calculation) VALUES (?, ?, ?, toTimeStamp(now()))';
        const params = [userId1, userId2, -1];
        await astraClient.execute(query, params);
    }

    static async delete(userId1, userId2) {
        const astraClient = await createLocalClient();
        const query = 'DELETE FROM Closeness_Records WHERE user_id1 = ? AND user_id2 = ?';
        const params = [userId1, userId2];
        await astraClient.execute(query, params);
    }

    static async find(userId1, userId2) {
        const astraClient = await createLocalClient();
        const query = 'SELECT * FROM Closeness_Records WHERE user_id1 = ? AND user_id2 = ?';
        const params = [userId1, userId2];
        const result = await astraClient.execute(query, params);
        return result.rows;
    }

    static async calc(userId1, userId2) {
        const astraClient = await createLocalClient();

        // Fetch the current closeness record
        const closenessRecord = await this.find(userId1, userId2);
        let closenessScore = 0;
        let lastCalculation = null;
        if (closenessRecord.length > 0) {
            closenessScore = closenessRecord[0].closeness_score;
            lastCalculation = closenessRecord[0].last_calculation;
        }

        // Fetch votes and supports for both users since the last calculation
        const votesQuery = 'SELECT * FROM Votes WHERE user_id IN (?, ?) AND writetime(vote) > ?';
        const supportsQuery = 'SELECT * FROM Support WHERE user_id IN (?, ?) AND writetime(support) > ?';
        const params = [userId1, userId2, lastCalculation];

        const votes = await astraClient.execute(votesQuery, params);
        const supports = await astraClient.execute(supportsQuery, params);

        // Group votes and supports by proposal id
        const votesByProposal = groupByProposal(votes.rows);
        const supportsByProposal = groupByProposal(supports.rows);

        // Update the closeness score based on votes and supports
        closenessScore += calculateScore(votesByProposal, 7, 'vote');
        closenessScore += calculateScore(supportsByProposal, 10, 'support');

        // Update the closeness record
        await this.insert(userId1, userId2, closenessScore);

        return closenessScore;
    }
}

function groupByProposal(records) {
    const grouped = {};
    for (let record of records) {
        if (!grouped[record.proposal_id]) {
            grouped[record.proposal_id] = [];
        }
        grouped[record.proposal_id].push(record);
    }
    return grouped;
}

function calculateScore(groupedRecords, scoreIncrement, type) {
    let score = 0;
    for (let proposalId in groupedRecords) {
        const records = groupedRecords[proposalId];
        if (records.length > 1) {  // Both users voted or supported the same proposal
            if (records[0][type] === records[1][type]) {  // They voted or supported the same way
                score += scoreIncrement;
            } else {  // They voted or supported in opposite ways
                score -= scoreIncrement;
            }
        }
    }
    return score;
}

module.exports = UserCloseness;

module.exports = UserCloseness;