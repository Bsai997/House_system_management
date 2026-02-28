const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const User = require('../models/User');
const House = require('../models/House');
const Event = require('../models/Event');
const Participation = require('../models/Participation');

const HOUSES = [
  { name: 'Jal', color: '#3B82F6', logo: '🌊' },
  { name: 'Vayu', color: '#8B5CF6', logo: '🌬️' },
  { name: 'Agni', color: '#EF4444', logo: '🔥' },
  { name: 'Akash', color: '#F59E0B', logo: '✨' },
  { name: 'Prudhvi', color: '#22C55E', logo: '🌍' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await House.deleteMany({});
    await Event.deleteMany({});
    await Participation.deleteMany({});
    console.log('Cleared existing data');

    // Create houses
    const houses = await House.insertMany(HOUSES);
    console.log('Created houses');

    // Create admin
    const adminPassword = await bcrypt.hash('admin123', 12);
    await User.create({
      name: 'Admin User',
      email: 'admin@college.edu',
      password: adminPassword,
      role: 'admin',
      department: 'CSD & CSIT',
    });
    console.log('Created admin');

    // Create mentors, team leads, and students for each house
    for (const house of houses) {
      const mentorPassword = await bcrypt.hash('mentor123', 12);
      const mentor = await User.create({
        name: `${house.name} Mentor`,
        email: `mentor.${house.name.toLowerCase()}@college.edu`,
        password: mentorPassword,
        role: 'mentor',
        houseId: house._id,
        department: 'CSD',
      });

      const leadPassword = await bcrypt.hash('lead123', 12);
      const teamLead = await User.create({
        name: `${house.name} Team Lead`,
        email: `lead.${house.name.toLowerCase()}@college.edu`,
        password: leadPassword,
        role: 'teamlead',
        houseId: house._id,
        regdNo: `TL${house.name.toUpperCase()}001`,
        year: 3,
        department: 'CSD',
      });

      // Update house with mentor and team lead
      await House.findByIdAndUpdate(house._id, {
        mentorId: mentor._id,
        teamLeadId: teamLead._id,
      });

      // Create 5 students per house (points start at 0, earned only through event attendance)
      for (let i = 1; i <= 5; i++) {
        const studentPassword = await bcrypt.hash('student123', 12);
        await User.create({
          name: `${house.name} Student ${i}`,
          email: `student${i}.${house.name.toLowerCase()}@college.edu`,
          password: studentPassword,
          role: 'student',
          houseId: house._id,
          regdNo: `${house.name.toUpperCase()}${String(i).padStart(3, '0')}`,
          year: Math.ceil(Math.random() * 4),
          department: i % 2 === 0 ? 'CSD' : 'CSIT',
          totalPoints: 0,
        });
      }
    }

    console.log('Created mentors, team leads, and students');
    console.log('\n=== Login Credentials ===');
    console.log('Admin: admin@college.edu / admin123');
    console.log('Mentor (Jal): mentor.jal@college.edu / mentor123');
    console.log('Team Lead (Jal): lead.jal@college.edu / lead123');
    console.log('Student (Jal): student1.jal@college.edu / student123');
    console.log('========================\n');

    await mongoose.connection.close();
    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
