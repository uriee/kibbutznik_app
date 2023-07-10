CREATE TABLE IF NOT EXISTS Statements (
    community_id uuid,
    statement_id uuid,
    status int, 
    statement_text text,
    PRIMARY KEY ((community_id), statement_id)
);

CREATE TABLE IF NOT EXISTS Variables (
    community_id uuid,
    variable_id uuid,
    variable_name text,
    variable_value double,
    PRIMARY KEY ((community_id), variable_id)
);

CREATE TABLE IF NOT EXISTS Default_Variable_Values (
    variable_id uuid,
    variable_name text,
    variable_default_value double,
    PRIMARY KEY (variable_id)
);

CREATE TABLE IF NOT EXISTS Communities (
    community_id uuid PRIMARY KEY,
    parent_community_id uuid
    memebers_count int, 
    name text,
    status text
);

CREATE TABLE IF NOT EXISTS Members (
    community_id uuid,
    user_id uuid,
    seniority int,
    PRIMARY KEY ((community_id), user_id)
);

CREATE TABLE IF NOT EXISTS Proposals (
    community_id uuid,
    proposal_id uuid,
    proposal_text text,
    proposal_status text,
    propsal_type
    proposal_support int,
    pulse_id uuid
    PRIMARY KEY ((community_id), proposal_id)
);

CREATE TABLE IF NOT EXISTS User_Membership_Proposals (
    user_id uuid,
    community_id uuid,
    proposal_id uuid,
    PRIMARY KEY ((user_id), proposal_id)
);

CREATE TABLE IF NOT EXISTS Variables_Proposals (
    variable_id uuid,
    proposal_id uuid,
    community_id uuid,
    variable_new_value text,
    PRIMARY KEY ((variable_id), proposal_id)
);


CREATE TABLE IF NOT EXISTS Statements_Proposals (
    statement_id uuid,
    proposal_id uuid,
    community_id uuid,
    statement_text text,
    PRIMARY KEY ((statement_id), proposal_id)
);


CREATE TABLE IF NOT EXISTS Support (
    user_id uuid,
    proposal_id uuid,
    support int,
    PRIMARY KEY ((user_id), proposal_id)
);

CREATE TABLE IF NOT EXISTS Accounts (
    community_id uuid PRIMARY KEY,
    wallet_address: text
    account_balance double
);

CREATE TABLE IF NOT EXISTS Membership_Fees (
    community_id uuid PRIMARY KEY,
    user_id uuid, 
    membership_fee double
);

CREATE TABLE IF NOT EXISTS Funding_Proposals (
    parent_community_id uuid,
    child_community_id uuid,
    proposal_id uuid,
    funding_amount double,
    PRIMARY KEY ((parent_community_id), child_community_id), proposal_id)
);


CREATE TABLE IF NOT EXISTS Votes (
    user_id uuid,
    community_id uuid,
    proposal_id uuid,
    vote int,
    PRIMARY KEY ((user_id), proposal_id)
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

CREATE INDEX IF NOT EXISTS ON communities(community_name);
CREATE INDEX IF NOT EXISTS ON proposals(proposal_status);
CREATE INDEX IF NOT EXISTS ON members(user_id);
CREATE INDEX IF NOT EXISTS ON votes(proposal_id);
CREATE INDEX IF NOT EXISTS ON support(user_id);
CREATE INDEX IF NOT EXISTS ON support(proposal_id);
CREATE INDEX IF NOT EXISTS ON pulse_proposals(proposal_status);
CREATE INDEX IF NOT EXISTS ON closeness(last_calculation);
CREATE INDEX IF NOT EXISTS ON pulse_support(user_id);
CREATE INDEX IF NOT EXISTS ON pulse_support(pulse_id);
CREATE INDEX IF NOT EXISTS ON statements(community_id);
CREATE INDEX IF NOT EXISTS ON community_variables(community_id);
CREATE INDEX IF NOT EXISTS ON pulse(community_id);
CREATE INDEX IF NOT EXISTS ON pulse_proposals(pulse_id);