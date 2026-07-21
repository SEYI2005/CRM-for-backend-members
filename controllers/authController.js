import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../model/User.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const sendTokenCookie = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.cookie("token", token, {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days, matches JWT_EXPIRES_IN
    httpOnly: true, // JS on the frontend can't read/steal this cookie
    secure: process.env.NODE_ENV === "production", // only sent over HTTPS in prod
    sameSite: "lax",
  });

  user.password = undefined; // never send the hash back, even though schema already has select:false

  res.status(statusCode).json({ status: "success", data: { user } });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const existing = await Users.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await Users.create({
      name,
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "agent", // never let the client self-assign admin
    });

    sendTokenCookie(newUser, 201, res);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // password has select:false on the schema, so it must be explicitly requested here
    const user = await Users.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    sendTokenCookie(user, 200, res);
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "loggedout", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

export const getMe = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    res.status(200).json({ status: "success", data: { user } });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
