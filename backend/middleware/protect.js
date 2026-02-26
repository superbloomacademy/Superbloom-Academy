import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const protect = async (req, res, next) => {
  let token;
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) token = auth.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const admin = await Admin.findById(payload.id);
    if (!admin) return res.status(401).json({ message: "Not authorized" });
    req.user = { id: admin._id, role: admin.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

export default protect;
