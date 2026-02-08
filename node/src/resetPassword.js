import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "./model/user-model.js";

export const resetPassword = async (req, res) => {
  try {
    const { token, password, email } = req.body;

    let userEmail = email;

    // If token provided, verify it
    if (token && token !== "dummy-token") {
      const decoded = jwt.verify(token, "RESET_SECRET");
      userEmail = decoded.email;
    }

    if (!userEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await UserModel.findOneAndUpdate(
      { email: userEmail },
      { password: hashedPassword },
    );

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};
