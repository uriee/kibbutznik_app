// models/Pulses.js
const DBClient = require('../utils/localDB.js');
const uuid = require('uuid');


const PULSE_STATUS_LIFECYCLE = ['Next', 'Active', 'Done'];

class Pulses {
    static async findByCommunityId(communityId) {
       const db = DBClient.getInstance();
        const query = 'SELECT * FROM Pulses WHERE community_id = ?';
        const params = [communityId];
        const result = await db.execute(query, params);
        return result.rows;
    }

    static async pulseIdByStatus(communityId, pulseStatus) {
       const db = DBClient.getInstance();
    
        // Fetch the community's active pulse
        const pulseQuery = `SELECT pulse_id FROM Pulses WHERE community_id = ${communityId} AND pulse_status = ${pulseStatus}`;
        console.log("pulseQuery", pulseQuery);
        const activePulse = await db.execute(pulseQuery);
    
        if (!activePulse.rows.length) {
            return null;  // Or some error message
        }
    
        const pulse_id = activePulse.rows[0].pulse_id;
        return pulse_id
    }

    static async create(communityId) {
        console.log("pulse", communityId);
        const db = DBClient.getInstance();
        const pulse_id = uuid.v4();
        const checkQuery = `SELECT * FROM Pulses WHERE community_id = ${communityId} AND pulse_status = 0`;
        console.log("checkQuery", checkQuery);
        const existingPulse = await db.execute(checkQuery);
        if (existingPulse.rows.length > 0) {
            throw new Error('A pulse with status 0 already exists in this community.');
        }

        const insertQuery = 'INSERT INTO Pulses (community_id, pulse_id, updated_at, pulse_status) VALUES (?, ?, totimestamp(now()), 0)';
        const params = [communityId, pulse_id];
        console.log("params", params);
        await db.execute(insertQuery, params, { hints : ['uuid', 'uuid', 'timestamp', 'text']});
        console.log("fine 1")
        const variableQuery = `SELECT variable_value FROM Variables WHERE community_id = ${communityId} AND variable_type = 'PulseSupport'`;
        const variables = await db.execute(variableQuery);
        console.log("fine 2",variables)
        const pulseSupport = variables.rows[0].variable_value;
        console.log("pulseSupport", pulseSupport,communityId)
        // Fetch the community's member_count
        const communityQuery = `SELECT member_count FROM member_counter WHERE community_id = ?`;
        const community = await db.execute(communityQuery, [communityId]);
        const member_count = (community.rows[0].member_count).toNumber();
        console.log("member_count", member_count,pulseSupport/ 100.0)
        console.log("member_count * pulseSupport",  Math.ceil(member_count* pulseSupport / 100 ))
        const counterQuery = `UPDATE pulse_counter SET member_count = member_count + ${member_count}, threshold=threshold+${Math.ceil(member_count* pulseSupport / 100)}  WHERE pulse_id = ${pulse_id}`;
        console.log("counterQuery", counterQuery);
        await db.execute(counterQuery);

        return pulse_id
    }

    static async PulseIncrementStatus(pulse_id, community_id, pulse_status) {
        try{
            const db = DBClient.getInstance();
            pulse_status += 1
            if (pulse_status == 1) {
                const checkQuery = `SELECT * FROM Pulses WHERE community_id = ${community_id} AND pulse_status = 1`;
                console.log("checkQuery", checkQuery);
                const existingPulse = await db.execute(checkQuery);
                if (existingPulse.rows.length > 0) {
                        throw new Error(`A pulse with status 1 already exists in this community.`);
             }
            }

            // assuming pulse_status gets incremented by 1 and updated_at gets the current timestamp
            const query = `UPDATE Pulses SET pulse_status = ${pulse_status}, updated_at = totimestamp(now()) WHERE community_id = ${community_id} and pulse_id = ${pulse_id}`;
            xxx = await db.execute(query);
            console.log("pulse_status", xxx)
            if(pulse_status == 1) {
                this.create(community_id)
            }
        }
        catch{
            return false
        }
        return true
    }

    
    static async findActive() {
       const db = DBClient.getInstance();
        const query = 'SELECT * FROM Pulses WHERE pulse_status = ?';
        const params = [1];
        const result = await db.execute(query, params);
        return result.rows;
    }

    static async time_4_pulse(pulse_id) {
        if (!pulse_id) {
            return null;
        }
        const db = DBClient.getInstance();
        const supportQuery = `SELECT pulse_support ,threshold FROM pulse_counter WHERE pulse_id = ${pulse_id}`;
        const pulseSupport_q = await db.execute(supportQuery);
        const threshold = pulseSupport_q.rows[0].threshold;
        const Pulse_Support = pulseSupport_q.rows[0].pulse_support;
        if (Pulse_Support >= threshold) {
            return true;
            } else {
            return false;
        }
    }

}
module.exports = Pulses;
