require('reflect-metadata');
const { AppDataSource } = require('../ormconfig');
const seedRoles = require('./roles/role.seed');

async function runSeeds() {
  try {
    console.log('Start seeding data for database');

    await AppDataSource.initialize();

    await seedRoles();

    console.log('All seeds executed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    process.exit();
  }
}

runSeeds();
