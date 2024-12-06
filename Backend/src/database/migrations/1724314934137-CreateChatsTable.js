const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class CreateChatsTable1724314934137 {
  name = 'CreateChatsTable1724314934137'

  async up(queryRunner) {
    await queryRunner.query(`
            CREATE TABLE \`chats\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`title\` varchar(255) NOT NULL,
                \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` timestamp NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE \`user_chats\``);
    await queryRunner.query(`DROP TABLE \`chat_contents\``);
    await queryRunner.query(`DROP TABLE \`chats\``);
  }
}
