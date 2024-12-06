const { EntitySchema } = require('typeorm');

const ChatContent = new EntitySchema({
    name: 'chat_contents',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        chat_id: {
            type: 'int',
        },
        user_message: {
            type: 'varchar',
        },
        bot_message: {
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
        chat: {
            type: 'many-to-one',
            target: 'chats',
            joinColumn: { name: 'chat_id' },
            inverseSide: 'chat_contents',
        }
    }
});

module.exports = ChatContent;
