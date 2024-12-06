const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class CreateChatContentsTable1724314934138 {
  name = 'CreateChatContentsTable1724314934138'

  async up(queryRunner) {
    await queryRunner.query(`
            CREATE TABLE \`chat_contents\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`chat_id\` int NOT NULL,
                \`user_message\` TEXT NOT NULL,
                \`bot_message\` TEXT NOT NULL,
                \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` timestamp NULL,
                PRIMARY KEY (\`id\`),
                CONSTRAINT \`FK_chat_contents_chats\` FOREIGN KEY (\`chat_id\`) REFERENCES \`chats\`(\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE \`chat_contents\``);
  }
}
