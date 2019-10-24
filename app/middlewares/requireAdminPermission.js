module.exports = (req, res, next) => {
  if (req.user.permission !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};