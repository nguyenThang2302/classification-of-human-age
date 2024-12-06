const { EntitySchema } = require('typeorm');

const Chat = new EntitySchema({
  name: 'chats',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    title: {
      type: 'varchar',
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP(6)',
    },
    updated_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP(6)',
      onUpdate: 'CURRENT_TIMESTAMP(6)',
    },
    deleted_at: {
      type: 'timestamp',
      nullable: true,
    },
  },
  relations: {
    chat_contents: {
      type: 'one-to-many',
      target: 'chat_contents',
      inverseSide: 'chat',
    },
    user_chats: {
      type: 'one-to-many',
      target: 'user_chats',
      inverseSide: 'chat',
    },
  },
});

module.exports = Chat;
