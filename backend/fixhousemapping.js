const mongoose = require("mongoose");
const User = require("./models/User");
require('dotenv').config();

async function fixStudentHouses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const fs = require("fs");
    const sql = fs.readFileSync("./std.sql", "utf8");
    
    const houseMapping = {
      1: new mongoose.Types.ObjectId("69b98374bd2eb89d322469c9"), // Prudhvi
      2: new mongoose.Types.ObjectId("69b98374bd2eb89d322469c6"), // Vayu
      3: new mongoose.Types.ObjectId("69b98374bd2eb89d322469c7"), // Agni
      4: new mongoose.Types.ObjectId("69b98374bd2eb89d322469c8"), // Akash
      5: new mongoose.Types.ObjectId("69b98374bd2eb89d322469c5")  // Jal
    };

    const matches = sql.match(/\((.*?)\)/g);
    
    const bulkOps = [];
    
    for (const row of matches) {
      const cols = row.replace(/[()']/g,"").split(",");
      const regdNo = cols[0].trim();
      const sqlHid = parseInt(cols[7].trim());
      const correctHouseId = houseMapping[sqlHid];
      
      bulkOps.push({
        updateOne: {
          filter: { regdNo: regdNo },
          update: { $set: { houseId: correctHouseId } }
        }
      });
    }

    const result = await User.bulkWrite(bulkOps);
    console.log(`✅ Updated ${result.modifiedCount} students with correct house IDs`);
    
    // Display current house distribution
    const distribution = await User.aggregate([
      { $match: { role: "student" } },
      { $group: { _id: "$houseId", count: { $sum: 1 } } },
      { $lookup: { from: "houses", localField: "_id", foreignField: "_id", as: "house" } },
      { $unwind: "$house" },
      { $project: { houseName: "$house.name", count: 1 } },
      { $sort: { houseName: 1 } }
    ]);
    
    console.log("\nFinal house distribution:");
    distribution.forEach(d => {
      console.log(`${d.houseName}: ${d.count} students`);
    });

    process.exit();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

fixStudentHouses();
