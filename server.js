// ./server.js
const express = require('express');
const userRoutes = require('./scr/routes/userRoutes');
const communityRoutes = require('./scr/routes/communityRoutes');  
const commentRoutes = require('./scr/routes/commentRoutes');
const memberRoutes = require('./scr/routes/memberRoutes');
const proposalRoutes = require('./scr/routes/proposalRoutes');
const pulseRoutes = require('./scr/routes/pulseRoutes');
const pulseSupportRoutes = require('./scr/routes/pulseSupportRoutes');
const supportRoutes = require('./scr/routes/SupportRoutes');
const userClosenessRoutes = require('./scr/routes/userClosenessRoutes');
const statementRoutes = require('./scr/routes/statementRoutes');
const variableRoutes = require('./scr/routes/variableRoutes');
const voteRoutes = require('./scr/routes/voteRoutes');
const bodyParser = require('body-parser');

//const variableDefault = require('./scr/modules/VariablesDefault')
//variableDefault.PopulateByBase()

const app = express();
const PORT = process.env.PORT || 3000;  // Use the PORT environment variable, or 3000 if it's not set

// To parse JSON bodies
app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/comments', commentRoutes);
app.use('/members', memberRoutes);
app.use('/proposlas', proposalRoutes);
app.use('/pulse', pulseRoutes);
app.use('/pulseSupport', pulseSupportRoutes);
app.use('/support', supportRoutes);
app.use('/userCloseness', userClosenessRoutes);
app.use('/statements', statementRoutes);
app.use('/variables', variableRoutes);
app.use('/communities', communityRoutes);
app.use('/vote', voteRoutes);

const server =  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
module.exports = server;
