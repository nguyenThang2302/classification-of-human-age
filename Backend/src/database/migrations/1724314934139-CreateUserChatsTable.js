const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class CreateUserChatsTable1724314934139 {
  name = 'CreateUserChatsTable1724314934139'

  async up(queryRunner) {
    await queryRunner.query(`
            CREATE TABLE \`user_chats\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`chat_id\` int NOT NULL,
                \`user_id\` int NOT NULL,
                \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` timestamp NULL,
                PRIMARY KEY (\`id\`),
                CONSTRAINT \`FK_user_chats_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`FK_user_chats_chat\` FOREIGN KEY (\`chat_id\`) REFERENCES \`chats\`(\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE \`user_chats\``);
  }
}
