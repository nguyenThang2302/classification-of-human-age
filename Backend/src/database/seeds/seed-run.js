require('reflect-metadata');
const { AppDataSource } = require('../ormconfig');
const seedUsers = require('./users/user.seed');

async function runSeeds() {
  try {
    console.log('Start seeding data for database');

    await AppDataSource.initialize();

    await seedUsers();

    console.log('All seeds executed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    process.exit();
  }
}

runSeeds();
