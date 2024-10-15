import jwt from "jsonwebtoken";

class JWTService {
  static tokenBlacklist = new Set();

  static sign(payload, expiry = "30d", secret = process.env.JWT_SECRET) {
    return jwt.sign(payload, secret, { expiresIn: expiry });
  }

  static verify(token, secret = process.env.JWT_SECRET) {
    if (this.tokenBlacklist.has(token)) {
      throw new Error("Token has been invalidated");
    }
    return jwt.verify(token, secret);
  }

  static invalidate(token) {
    this.tokenBlacklist.add(token);
  }

  static isTokenValid(token) {
    return !this.tokenBlacklist.has(token);
  }
}

export default JWTService;