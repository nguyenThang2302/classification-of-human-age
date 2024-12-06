const { AppDataSource } = require('../../ormconfig');
const User = require('../../entities/user.entity');
const bcrypt = require('bcrypt');

async function seedUsers() {
  const userRepository = AppDataSource.getRepository(User);

  const users = [
    {
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
    },
    {
      id: 2,
      name: 'Bob',
      email: 'bob@example.com',
    },
  ];

  for (const userData of users) {
    const hasedPassword = await bcrypt.hash('Tes1234', 10);
    userData['password'] = hasedPassword;
    const user = userRepository.create(userData);
    await userRepository.save(user);
  }

  console.log('Users seeded done');
}

module.exports = seedUsers;
