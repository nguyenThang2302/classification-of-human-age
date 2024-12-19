const { EntitySchema } = require('typeorm');

const ImageDetails = new EntitySchema({
    name: 'image_details',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        image_id: {
            type: 'int',
        },
        secure_url: {
            type: 'varchar',
        },
        gender: {
            type: 'int',
        },
        age: {
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
        },
    },
    relations: {
      image: {
          type: 'many-to-one',
          target: 'images',
          joinColumn: { name: 'image_id' },
          inverseSide: 'image_details',
      }
    }
});

module.exports = ImageDetails;
