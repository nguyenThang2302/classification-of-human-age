const { EntitySchema } = require('typeorm');

const Image = new EntitySchema({
    name: 'images',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        name: {
            type: 'varchar',
        },
        url: {
            type: 'varchar',
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
          inverseSide: 'image',
      },
      image_details: {
          type: 'one-to-many',
          target: 'image_details',
          inverseSide: 'image',
      }
    }
});

module.exports = Image;
