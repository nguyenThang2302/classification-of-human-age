const { EntitySchema } = require('typeorm');

const UserImage = new EntitySchema({
    name: 'user_images',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        user_id: {
            type: 'int',
        },
        image_id: {
            type: 'int',
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
        user: {
            type: 'many-to-one',
            target: 'users',
            joinColumn: { name: 'user_id' },
            inverseSide: 'user_images',
        },
        image: {
            type: 'many-to-one',
            target: 'images',
            joinColumn: { name: 'image_id' },
            inverseSide: 'user_images',
        }
    }
});

module.exports = UserImage;
