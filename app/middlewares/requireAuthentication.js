module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({
      success: false,
      message: 'You are not authentic'
    });
  } 
  next();
};