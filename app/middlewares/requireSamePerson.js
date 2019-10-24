module.exports = (req, res, next) => {
  if (req.user.permission === 'user' && req.user._id !== req.params.userId) {
    return res.status(403).json({ message: 'Access denied'});
  }
  next();
};