
import JWTService from "../services/JWTService.js";

const authorization = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(404).json({
      success: false,
      message: "Token is not found",
    });
  }
  try {
    let token = authHeader.split(" ")[1];
    
    const { _id, role ,languageId} = await JWTService.verify(token);
    const user = {
      _id,
      role,
      languageId,
    };

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: `Error occur ${err.message}`,
    });
  }
};

export default authorization;
