import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.SECRET_KEY,
    {
      expiresIn: "1d",       // Reduced from 7d to limit exposure window
      algorithm: "HS256",    // Explicit algorithm to prevent confusion attacks
    }
  );
};