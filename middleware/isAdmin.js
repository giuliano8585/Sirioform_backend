const isAdmin = (req, res, next) => {
  console.log("isAdmin middleware activated. User info:", req.user); // Log user info

  if (req.user && req.user?.role=='admin') {
    next();
  } else {
    console.error("Access denied, not an admin");
    res.status(403).json({ message: 'Access denied, not an admin' });
  }
};

module.exports = isAdmin;
