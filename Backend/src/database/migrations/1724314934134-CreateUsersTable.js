const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class CreateUsersTable1724314934134 {
    name = 'CreateUsersTable1724314934134'

    async up(queryRunner) {
      await queryRunner.query(`
        CREATE TABLE \`users\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`name\` varchar(255) NOT NULL,
          \`email\` varchar(255) NOT NULL,
          \`password\` varchar(255) NOT NULL,
          \`role_id\` int NOT NULL,
          \`secret\` varchar(255) NOT NULL,
          \`is_2fa_enabled\` tinyint(1) NOT NULL DEFAULT 0,
          \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          \`deleted_at\` timestamp NULL,
          PRIMARY KEY (\`id\`),
          CONSTRAINT \`FK_user_roles\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB
      `);
  }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE \`user_images\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }
}
