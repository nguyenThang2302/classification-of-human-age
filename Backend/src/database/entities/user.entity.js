const { EntitySchema } = require('typeorm');

const User = new EntitySchema({
    name: 'users',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        name: {
            type: 'varchar',
        },
        email: {
            type: 'varchar',
        },
        password: {
            type: 'varchar'
        },
        role_id: {
            type: 'int',
        },
        secret: {
            type: 'varchar',
        },
        is_2fa_enabled: {
            type: 'boolean',
            default: false,
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
      roles: {
          type: 'many-to-one',
          target: 'roles',
          joinColumn: { name: 'role_id' },
          nullable: true,
      },
      user_images: {
          type: 'one-to-many',
          target: 'user_images',
          inverseSide: 'user',
      },
      user_chats: {
          type: 'one-to-many',
          target: 'user_chats',
          inverseSide: 'user',
      }
    }
});

module.exports = User;
