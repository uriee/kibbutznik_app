const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Community = require('../models/Community');
const Member = require('../models/Member');
const Pulse = require('../models/Pulse');
const Support = require('../models/Support');
const Variable = require('../models/Variable');
const Closeness = require('../models/Closeness');
const Vote = require('../models/Vote');


exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'No user found with this id' });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }
};

exports.restrictTo = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
    next();
  };
};

exports.restrictToCommunity = async (req, res, next) => {
  const communityId = req.params.communityId;
  const community = await Community.findById(communityId);

  if (!community) {
    return res.status(404).json({ message: 'Community not found' });
  }

  const isMember = community.members.some(member => member.equals(req.user._id));

  if (!isMember) {
    return res.status(403).json({ message: 'You are not a member of this community' });
  }

  next();
};


exports.restrictToCommunityAsset = async (req, res, next) => {
  let asset;

  // Identify the type of asset from the request parameters, headers, or body
  switch (req.params.assetType) {
    case 'member':
      asset = await Member.findById(req.params.assetId);
      break;
    case 'pulse':
      asset = await Pulse.findById(req.params.assetId);
      break;
    case 'support':
      asset = await Support.findById(req.params.assetId);
      break;
    case 'variable':
      asset = await Variable.findById(req.params.assetId);
      break;
    case 'closeness':
      asset = await Closeness.findById(req.params.assetId);
      break;
    case 'vote':
      asset = await Vote.findById(req.params.assetId);
      break;
    case 'community':
      asset = await Community.findById(req.params.assetId);
      break;
    default:
      return res.status(400).json({ message: 'Invalid asset type' });
  }

  if (!asset) {
    return res.status(404).json({ message: 'Asset not found' });
  }

  // Assuming the asset document has a property `communityId` 
  const community = await Community.findById(asset.communityId);
  const isMember = community.members.some(member => member.equals(req.user._id));

  if (!isMember) {
    return res.status(403).json({ message: 'You are not a member of this community' });
  }

  next();
};