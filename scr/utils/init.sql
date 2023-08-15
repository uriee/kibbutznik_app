CREATE TABLE IF NOT EXISTS Statements (
    community_id uuid,
    statement_id uuid,
    status int, 
    statement_text text,
    PRIMARY KEY (community_id, statement_id)
);

CREATE TABLE IF NOT EXISTS Variables (
    community_id uuid,
    variable_id uuid,
    variable_type text,
    variable_value text,
    variable_desc text,
    PRIMARY KEY (community_id, variable_type)
);

CREATE TABLE IF NOT EXISTS Default_Variable_Values (
    variable_type text,
    variable_default_value text,
    variable_desc text,
    PRIMARY KEY(variable_type)
);


CREATE TABLE IF NOT EXISTS Communities (
    community_id uuid,
    parent_community_id uuid,
    members_count int, 
    wallet_address text,
    account_balance double,
    status int,
    PRIMARY KEY(community_id)
);

CREATE TABLE IF NOT EXISTS Members (
    community_id uuid,
    user_id uuid,
    status int,
    seniority int,
    PRIMARY KEY ((community_id), user_id)
);

CREATE TABLE IF NOT EXISTS Users (
    user_id uuid, 
    user_name text,
    password text,
    about text,
    wallet_address text,
    PRIMARY KEY(user_id)
);

CREATE TABLE  Proposals (
    community_id uuid,
    user_id uuid,
    proposal_id uuid,
    proposal_text text,
    proposal_status text,
    proposal_type text,
    pulse_id uuid,
    age int,
    created_at timestamp,
    updated_at timestamp,
    val_uuid uuid,
    val_text text,
    PRIMARY KEY (community_id, proposal_id)
);

CREATE TABLE IF NOT EXISTS proposal_counters (
    proposal_id uuid PRIMARY KEY,
    proposal_support counter,
    proposal_vote counter
);

CREATE TABLE IF NOT EXISTS Membership_Payment (
    payment_id uuid,
    community_id uuid,
    user_id uuid, 
    ammount double,
    PRIMARY KEY(payment_id, user_id, community_id)
);

CREATE TABLE IF NOT EXISTS Payment (
    payment_id uuid ,
    community_id uuid,
    pay_to_address text,
    about text,
    ammount double, 
    PRIMARY KEY(payment_id, community_id)
);


CREATE TABLE IF NOT EXISTS UserVotes (
    user_id uuid,
    proposal_id uuid,
    created_at timestamp,
    PRIMARY KEY (user_id, proposal_id)
);

CREATE TABLE IF NOT EXISTS UserSupport (
    user_id uuid,
    proposal_id uuid,
    created_at timestamp, 
    PRIMARY KEY (user_id, proposal_id)
);

CREATE TABLE IF NOT EXISTS Closeness_Records (
    user_id1 uuid,
    user_id2 uuid,
    closeness_score double,
    last_calculation timestamp,
    PRIMARY KEY (user_id1, user_id2)
);

CREATE TABLE IF NOT EXISTS Pulses (
    community_id uuid,
    pulse_id uuid,
    updated_at timestamp,
    pulse_status int, 
    PRIMARY KEY (community_id, pulse_id)
);

CREATE TABLE IF NOT EXISTS Pulse_Support (
    pulse_id uuid,
    user_id uuid,
    PRIMARY KEY (pulse_id, user_id)
);

CREATE TABLE IF NOT EXISTS Comments (
    comment_id uuid,
    parent_comment_id uuid,
    entity_id uuid,
    entity_type text,
    user_id uuid,
    comment_text text,
    comment_timestamp timestamp,
    score int,
    PRIMARY KEY(entity_id, comment_id)
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
CREATE INDEX IF NOT EXISTS ON variables(community_id);
CREATE INDEX IF NOT EXISTS ON pulse(community_id);