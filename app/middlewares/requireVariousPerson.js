module.exports = (req, res, next) => {
  if (req.user._id === req.params.userId) {
    return res.status(403).json({ message: 'Can not manipulate on loging user'});
  }
  next();
};