require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    
    const adminExists = await User.findOne({ email: "admin@taskmanager.com" });
    if (adminExists) {
      console.log("Admin user already exists!");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin",
      email: "admin@taskmanager.com",
      password: hashedPassword,
      role: "admin",
      isApproved: true
    });

    console.log("Admin user created successfully!");
    process.exit();
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
