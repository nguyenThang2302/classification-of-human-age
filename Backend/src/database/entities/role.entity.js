const { EntitySchema } = require('typeorm');

const Role = new EntitySchema({
    name: 'roles',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        name: {
            type: 'varchar',
            length: 255,
        },
        created_at: {
            type: 'timestamp',
            createDate: true,
        },
        updated_at: {
            type: 'timestamp',
            updateDate: true,
        },
        deleted_at: {
            type: 'timestamp',
            nullable: true,
        }
    },
    relations: {
      users: {
        type: 'one-to-many',
        target: 'users',
        inverseSide: 'role',
      }
    }
});

module.exports = Role;
