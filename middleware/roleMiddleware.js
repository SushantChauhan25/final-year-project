const roleMiddleware = (allowedRoles = []) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized access' })
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Role not authorized' })
  }

  next()
}

module.exports = roleMiddleware
