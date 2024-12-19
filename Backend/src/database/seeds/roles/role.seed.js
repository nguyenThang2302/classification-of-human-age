const { AppDataSource } = require('../../ormconfig');
const Role = require('../../entities/role.entity');

async function seedRoles() {
  const roleRepository = AppDataSource.getRepository(Role);

  const roles = [
    {
      id: 1,
      name: 'admin',
    },
    {
      id: 2,
      name: 'user',
    },
  ];

  for (const roleData of roles) {
    const role = roleRepository.create(roleData);
    await roleRepository.save(role);
  }

  console.log('Roles seeded done');
}

module.exports = seedRoles;
