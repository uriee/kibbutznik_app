# kibbutznik_app
Kibbutznik App  
/kibbutznik-app  
|-- /node_modules  
|-- /public  
|   |-- /css  
|   |   |-- styles.css  
|   |-- /js  
|   |   |-- main.js  
|   |-- index.html  
|-- /src  
|   |-- /models  
|   |   |-- Community.js  
|   |   |-- User.js  
|   |   |-- Proposal.js  
|   |   |-- Action.js  
|   |   |-- Member.js  
|   |   |-- Pulse.js  
|   |   |-- Support.js  
|   |   |-- Vote.js  
|   |   |-- Statement.js  
|   |   |-- Variable.js  
|   |-- /controllers  
|   |   |-- communityController.js  
|   |   |-- userController.js  
|   |   |-- proposalController.js  
|   |   |-- actionController.js  
|   |   |-- memberController.js  
|   |   |-- pulseController.js  
|   |   |-- supportController.js  
|   |   |-- voteController.js  
|   |   |-- statementController.js  
|   |   |-- variableController.js  
|   |-- /routes  
|   |   |-- communityRoutes.js  
|   |   |-- userRoutes.js  
|   |   |-- proposalRoutes.js  
|   |   |-- actionRoutes.js  
|   |   |-- memberRoutes.js  
|   |   |-- pulseRoutes.js  
|   |   |-- supportRoutes.js  
|   |   |-- voteRoutes.js  
|   |   |-- statementRoutes.js  
|   |   |-- variableRoutes.js  
|   |-- /services  
|   |   |-- emailService.js  
|   |   |-- cryptoService.js  
|   |-- /middlewares  
|   |   |-- authMiddleware.js  
|   |   |-- errorMiddleware.js  
|   |-- /utils  
|   |   |-- database.js  
|   |   |-- closenessCalculation.js  
|-- /tests  
|   |-- /unit  
|   |-- /integration  
|-- server.js  
|-- package.json  
|-- .gitignore  
|-- README.md  


TODO: 
Vote -> pass -> execute proposal
Vote -> fail -> incrementStatus(_,false)
support+ -> assign to pulse
support- -> Garbage collector
pulse: 
    get on the air
    proposal -> is pass
