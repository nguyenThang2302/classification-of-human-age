const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class CreateRolesTable1724314934133 {
    name = 'CreateRolesTable1724314934133'

    async up(queryRunner) {
      await queryRunner.query(`
        CREATE TABLE \`roles\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`name\` varchar(255) NOT NULL,
          \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          \`deleted_at\` timestamp NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB
      `);
  }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
    }
}
