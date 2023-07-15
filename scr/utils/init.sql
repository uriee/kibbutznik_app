CREATE TABLE IF NOT EXISTS Statements (
    community_id uuid,
    statement_id uuid PRIMARY KEY,
    status int, 
    statement_text text,
);

CREATE TABLE IF NOT EXISTS Variables (
    community_id uuid,
    variable_id uuid, PRIMARY KEY
    variable_type text,
    variable_value text,
    variable_desc text
);

CREATE TABLE IF NOT EXISTS Default_Variable_Values (
    variable_id uuid, PRIMARY KEY
    variable_type text,
    variable_default_value text,
    variable_desc text,
);


CREATE TABLE IF NOT EXISTS Communities (
    community_id uuid PRIMARY KEY,
    parent_community_id uuid
    memebers_count int, 
    wallet_address: text
    account_balance double
    status int
);

CREATE TABLE IF NOT EXISTS Members (
    community_id uuid,
    user_id uuid,
    status int
    seniority int,
    PRIMARY KEY ((community_id), user_id)
);

CREATE TABLE IF NOT EXISTS Users (
    user_id uuid PRIMARY KEY, 
    user_name text,
    password text,
    about text,
    wallet_address text
);

CREATE TABLE IF NOT EXISTS Proposals (
    community_id uuid,
    proposal_id uuid PRIMARY KEY,
    proposal_text text,
    proposal_status text,
    propsal_type
    proposal_support int,
    pulse_id uuid,
    val_uuid uuid,
    val_text text,
    age: int
    created_at timestamp
    updated_at timestamp
);


CREATE TABLE IF NOT EXISTS Support (
    user_id uuid,
    proposal_id uuid,
    support int,
    PRIMARY KEY ((user_id), proposal_id)
);


CREATE TABLE IF NOT EXISTS Membership_Payment (
    community_id uuid PRIMARY KEY,
    user_id uuid, 
    ammount double
);

CREATE TABLE IF NOT EXISTS Payment (
    payment_id uuid PRIMARY KEY,
    community_id uuid
    pay_to_address text
    about text
    ammount double, 
);



CREATE TABLE IF NOT EXISTS Votes (
    user_id uuid,
    proposal_id uuid,
    vote int,
    PRIMARY KEY ((user_id), proposal_id)
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
    pulse_id uuid PRIMARY KEY,
    updated_at timestamp,
    pulse_status int, 
);

CREATE TABLE IF NOT EXISTS Pulse_Support (
    pulse_id uuid,
    user_id uuid,
    PRIMARY KEY ((pulse_id), user_id)
);

CREATE TABLE IF NOT EXISTS Comments (
    comment_id uuid PRIMARY KEY,
    parent_comment_id uuid,
    entity_id uuid,
    entity_type text,
    user_id uuid,
    comment_text text,
    comment_timestamp timestamp,
    score int
);

CREATE INDEX IF NOT EXISTS ON communities(community_name);
CREATE INDEX IF NOT EXISTS ON proposals(proposal_status);
CREATE INDEX IF NOT EXISTS ON members(user_id);
CREATE INDEX IF NOT EXISTS ON votes(proposal_id);
CREATE INDEX IF NOT EXISTS ON support(user_id);
CREATE INDEX IF NOT EXISTS ON support(proposal_id);
CREATE INDEX IF NOT EXISTS ON pulse_support(proposal_status);
CREATE INDEX IF NOT EXISTS ON closeness(last_calculation);
CREATE INDEX IF NOT EXISTS ON pulse_support(user_id);
CREATE INDEX IF NOT EXISTS ON pulse_support(pulse_id);
CREATE INDEX IF NOT EXISTS ON statements(community_id);
CREATE INDEX IF NOT EXISTS ON community_variables(community_id);
CREATE INDEX IF NOT EXISTS ON pulse(community_id);