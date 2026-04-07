const mongoose = require("mongoose");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const House = require("./models/House");
require('dotenv').config();

async function importStudents() {

  await mongoose.connect(process.env.MONGODB_URI);

  const sql = fs.readFileSync("./std.sql", "utf8");

  // SQL hid to house name mapping
  const sqlHidToHouseName = {
    1: "Prudhvi",
    2: "Vayu",
    3: "Agni",
    4: "Akash",
    5: "Jal"
  };

  // Get all houses and create a map by name
  const houses = await House.find({});
  const houseByName = {};
  houses.forEach((house) => {
    houseByName[house.name] = house._id;
  });

  console.log("House Mapping:", houseByName);

  // Determine year from regdNo prefix
  const yearFromRegdNo = (regdNo) => {
    if (regdNo.startsWith("24") || regdNo.startsWith("25")) return 2;
    if (regdNo.startsWith("23")) return 3;
    return 4;
  };

  const matches = sql.match(/\((.*?)\)/g);

  // Hash all passwords before insert (insertMany skips pre-save hooks)
  const users = await Promise.all(matches.map(async row => {

    const cols = row.replace(/[()']/g,"").split(",");
    const regdNo = cols[0].trim();
    const hashedPassword = await bcrypt.hash(regdNo, 12);
    
    const sqlHid = cols[7].trim();
    const houseName = sqlHidToHouseName[sqlHid];
    const houseId = houseByName[houseName];

    return {
      name: cols[1].trim(),
      email: cols[2].trim(),
      password: hashedPassword,
      role: "student",
      regdNo,
      department: cols[4].trim(),
      year: yearFromRegdNo(regdNo),
      houseId: houseId,
      profileImage: "",
      totalPoints: 0
    };

  }));

  await User.insertMany(users,{ordered:false});

  console.log("✅ All students imported successfully");

  process.exit();
}

importStudents();