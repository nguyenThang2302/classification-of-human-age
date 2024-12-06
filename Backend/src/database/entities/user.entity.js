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
