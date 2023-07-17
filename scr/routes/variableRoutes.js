const express = require('express');
const router = express.Router();
const Variables = require('./variables');
const uuid = require('uuid');

// Create a new variable
router.post('/variables', async (req, res) => {
    try {
        const { variable_id, variable_name, variable_value, variable_desc } = req.body;
        const newVariable = { 
            community_id: uuid.v4(), 
            variable_id: variable_id, 
            variable_name: variable_name, 
            variable_value: variable_value, 
            variable_desc: variable_desc 
        };

        await Variables.create(newVariable);
        console.log('Variable created successfully!');
        res.status(201).json({ message: 'Variable created successfully!', variable: newVariable });
    } catch (error) {
        console.error('Failed to create variable:', error);
        res.status(500).json({ message: 'Failed to create variable' });
    }
});

// Get variable value
router.get('/variables/:communityId/:variableType', async (req, res) => {
    try {
        const communityId = req.params.communityId;
        const variableType = req.params.variableType;
        const variableValue = await Variables.getVariableValue(communityId, variableType);
        res.status(200).json({ variable_value: variableValue });
    } catch (error) {
        console.error('Failed to get variable value:', error);
        res.status(500).json({ message: 'Failed to get variable value' });
    }
});

// Get variable by community id and variable type
router.get('/variables/:communityId/:variableType', async (req, res) => {
    try {
        const communityId = req.params.communityId;
        const variableType = req.params.variableType;
        const variable = await Variables.getVariableValue(communityId, variableType);
        res.status(200).json({ variable: variable });
    } catch (error) {
        console.error('Failed to get variable:', error);
        res.status(500).json({ message: 'Failed to get variable' });
    }
});

module.exports = router;
