const { EntitySchema } = require('typeorm');

const UserChat = new EntitySchema({
  name: 'user_chats',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    user_id: {
      type: 'int',
    },
    chat_id: {
      type: 'int',
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
    user: {
      type: 'many-to-one',
      target: 'users',
      joinColumn: { name: 'user_id' },
      inverseSide: 'user_chats',
    },
    chat: {
      type: 'many-to-one',
      target: 'chats',
      joinColumn: { name: 'chat_id' },
      inverseSide: 'user_chats',
    },
  },
});

module.exports = UserChat;
