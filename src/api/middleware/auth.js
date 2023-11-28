import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const checkUserAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_USER_KEY);

    req.userData = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Auth failed" });
  }
};

const checkVendorAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_VENDOR_KEY);

    req.vendorData = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Auth failed" });
  }
};

export { checkUserAuth, checkVendorAuth };
