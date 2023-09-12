const mongoose = require("mongoose");
const express = require("express");
const { User, Course, Admin } = require("../db");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../middleware/auth");
const { authenticateJwt } = require("../middleware/auth");

const router = express.Router();

router.get(
  "https://nudemy-backend.vercel.app/me",
  authenticateJwt,
  async (req, res) => {
    const admin = await Admin.findOne({ username: req.user.username });
    if (!admin) {
      res.status(403).json({ msg: "Admin doesnt exist" });
      return;
    }
    res.json({
      username: admin.username,
    });
  }
);

router.post("https://nudemy-backend.vercel.app/signup", (req, res) => {
  const { username, password } = req.body;
  function callback(admin) {
    if (admin) {
      res.status(403).json({ message: "Admin already exists" });
    } else {
      const obj = { username: username, password: password };
      const newAdmin = new Admin(obj);
      newAdmin.save();

      const token = jwt.sign({ username, role: "admin" }, SECRET, {
        expiresIn: "1d",
      });
      res.json({ message: "Admin created successfully", token });
    }
  }
  Admin.findOne({ username }).then(callback);
});

router.post("https://nudemy-backend.vercel.app/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = jwt.sign({ username, role: "admin" }, SECRET, {
      expiresIn: "1d",
    });
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

router.post(
  "https://nudemy-backend.vercel.app/courses",
  authenticateJwt,
  async (req, res) => {
    const course = new Course(req.body);
    await course.save();
    res.json({ message: "Course created successfully", courseId: course.id });
  }
);

router.put(
  "https://nudemy-backend.vercel.app/courses/:courseId",
  authenticateJwt,
  async (req, res) => {
    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      req.body,
      {
        new: true,
      }
    );
    if (course) {
      res.json({ message: "Course updated successfully" });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  }
);

router.get(
  "https://nudemy-backend.vercel.app/courses",
  authenticateJwt,
  async (req, res) => {
    const courses = await Course.find({});
    res.json({ courses });
  }
);

router.get(
  "https://nudemy-backend.vercel.app/course/:courseId",
  authenticateJwt,
  async (req, res) => {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    res.json({ course });
  }
);
router.delete(
  "https://nudemy-backend.vercel.app/courses/:courseId",
  authenticateJwt,
  async (req, res) => {
    const course = await Course.findByIdAndDelete(
      req.params.courseId,
      req.body,
      {
        new: true,
      }
    );
    if (course) {
      res.json({ message: "Course deleted successfully" });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  }
);
module.exports = router;
