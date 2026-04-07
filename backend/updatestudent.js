const mongoose = require("mongoose");
const User = require("./models/User");
require('dotenv').config();

async function updateStudentYears() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update students with regdNo starting with 24 or 25 to year 2
    const update24_25 = await User.updateMany(
      { regdNo: { $regex: "^(24|25)" } },
      { year: 2 }
    );
    console.log(`Updated ${update24_25.modifiedCount} students with regdNo 24/25 to year 2`);

    // Update students with regdNo starting with 23 to year 3
    const update23 = await User.updateMany(
      { regdNo: { $regex: "^23" } },
      { year: 3 }
    );
    console.log(`Updated ${update23.modifiedCount} students with regdNo 23 to year 3`);

    // Update remaining to year 4
    const update_other = await User.updateMany(
      { regdNo: { $regex: "^(?!23|24|25)" } },
      { year: 4 }
    );
    console.log(`Updated ${update_other.modifiedCount} students with other regdNo to year 4`);

    console.log("✅ All student years updated successfully");
    process.exit();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

updateStudentYears();
