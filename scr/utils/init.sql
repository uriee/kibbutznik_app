CREATE TABLE IF NOT EXISTS Users (
    user_id uuid PRIMARY KEY,
    username text,
    password text,
    role text,
    email text
);

CREATE TABLE IF NOT EXISTS Community_Statements (
    community_id uuid,
    statement_id uuid,
    statement_text text,
    PRIMARY KEY ((community_id), statement_id)
);

CREATE TABLE IF NOT EXISTS Variables (
    community_id uuid,
    variable_id uuid,
    variable_name text,
    variable_value double,
    variable_text_value text,
    PRIMARY KEY ((community_id), variable_id)
);

CREATE TABLE IF NOT EXISTS Default_Variables (
    variable_id uuid,
    variable_name text,
    variable_default_value double,
    PRIMARY KEY (variable_id)
);

CREATE TABLE IF NOT EXISTS Communities (
    community_id uuid PRIMARY KEY,
    parent_community_id uuid
    name text,
    status text
);

CREATE TABLE IF NOT EXISTS Members (
    community_id uuid,
    user_id uuid,
    seniority int,
    fee float,
    PRIMARY KEY ((community_id), user_id)
);

CREATE TABLE IF NOT EXISTS Proposals (
    community_id uuid,
    user_id uuid,
    proposal_id uuid,
    proposal_type int 
    proposal_text text,
    proposal_stage text,
    proposal_support int,
    PRIMARY KEY ((community_id), proposal_id)
);

CREATE TABLE IF NOT EXISTS Member_Votes (
    proposal_id uuid,
    user_id uuid,
    vote text,
    PRIMARY KEY ((proposal_id), user_id)
);

CREATE TABLE IF NOT EXISTS Member_Support (
    user_id uuid,
    proposal_id uuid,
    support int,
    PRIMARY KEY ((user_id), proposal_id)
);

CREATE TABLE IF NOT EXISTS Community_Accounts (
    community_id uuid PRIMARY KEY,
    account_balance double
);


CREATE TABLE IF NOT EXISTS Funding_Proposals (
    parent_community_id uuid,
    child_community_id uuid,
    proposal_id uuid,
    funding_amount double,
    PRIMARY KEY (parent_community_id, child_community_id, proposal_id)
);

CREATE TABLE IF NOT EXISTS Proposal_Supporters (
    proposal_id uuid,
    user_id uuid,
    PRIMARY KEY ((proposal_id), user_id)
);

CREATE TABLE IF NOT EXISTS Closeness_Records (
    user_id1 uuid,
    user_id2 uuid,
    closeness_score double,
    last_calculation timestamp,
    PRIMARY KEY ((user_id1), user_id2)
);


CREATE TABLE IF NOT EXISTS Membership_Proposals (
    user_id uuid,
    community_id uuid,
    proposal_id uuid,
    pitch text,
    PRIMARY KEY ((user_id), proposal_id)
);

CREATE TABLE IF NOT EXISTS Statements_Proposals (
    proposal_id uuid,
    statement_text text,
    replace_statement uuid 
    PRIMARY KEY ((user_id), proposal_id)
);

CREATE TABLE IF NOT EXISTS Variables_Proposals (
    proposal_id uuid,
    variable_id uuid,
    value int,
    value_text text,
    PRIMARY KEY ((user_id), proposal_id)
);

CREATE TABLE IF NOT EXISTS Pulses (
    community_id uuid,
    pulse_id uuid,
    pulse_timestamp timestamp,
    pulse_status int, 
    PRIMARY KEY ((community_id), pulse_id)
);

CREATE TABLE IF NOT EXISTS Pulse_Supporters (
    pulse_id uuid,
    user_id uuid,
    PRIMARY KEY ((pulse_id), user_id)
);

CREATE INDEX IF NOT EXISTS ON Communities(community_name);
CREATE INDEX IF NOT EXISTS ON Proposals(proposal_status);
CREATE INDEX IF NOT EXISTS ON Members(user_id);
CREATE INDEX IF NOT EXISTS ON Votes(proposal_id);
CREATE INDEX IF NOT EXISTS ON Support(user_id);
CREATE INDEX IF NOT EXISTS ON Support(proposal_id);
CREATE INDEX IF NOT EXISTS ON Pulse_proposals(proposal_status);
CREATE INDEX IF NOT EXISTS ON Closeness(last_calculation);
CREATE INDEX IF NOT EXISTS ON Pulse_support(user_id);
CREATE INDEX IF NOT EXISTS ON Pulse_support(pulse_id);
CREATE INDEX IF NOT EXISTS ON Statements(community_id);
CREATE INDEX IF NOT EXISTS ON Variables(community_id);
CREATE INDEX IF NOT EXISTS ON Pulse(community_id);
CREATE INDEX IF NOT EXISTS ON Pulse_proposals(pulse_id);