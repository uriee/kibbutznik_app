const Communities = require('../models/Communities');

exports.getCommunity = async (req, res, next) => {
    try {
        const community = await Communities.findById(req.params.id);
        if (!community) {
            return next(new Error(`No community found with id ${req.params.id}`));
        }
        res.json(community);
    } catch (err) {
        next(err);
    }
};

exports.createCommunity = async (req, res, next) => {
    try {
        await Communities.create(req.body);
        res.status(201).json({
            status: 'success',
            data: req.body,
        });
    } catch (err) {
        next(err);
    }
};

exports.getParents = async (req, res, next) => {
    try {
        const parents = await Communities.getParentsTree(req.params.id);
        if (!parents) {
            return next(new Error(`No parents found for community with id ${req.params.id}`));
        }
        res.json(parents);
    } catch (err) {
        next(err);
    }
};

exports.getChildren = async (req, res, next) => {
    try {
        const children = await Communities.getChildrenTree(req.params.id);
        if (!children) {
            return next(new Error(`No children found for community with id ${req.params.id}`));
        }
        res.json(children);
    } catch (err) {
        next(err);
    }
};

exports.checkIsParentOf = async (req, res, next) => {
    try {
        const isParent = await Communities.isParentOf(req.params.parent_id, req.params.child_id);
        res.json(isParent);
    } catch (err) {
        next(err);
    }
};

exports.checkIsChildOf = async (req, res, next) => {
    try {
        const isChild = await Communities.isChildOf(req.params.child_id, req.params.parent_id);
        res.json(isChild);
    } catch (err) {
        next(err);
    }
};
