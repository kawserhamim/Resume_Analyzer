import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No token provided", msg: "No token provided" });
  }

  // Support both "Bearer <token>" and raw token
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided", msg: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY, {
      algorithms: ["HS256"],
    });
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token has expired", msg: "Token has expired" });
    }
    return res.status(401).json({ success: false, message: "Invalid token", msg: "Invalid token" });
  }
};