const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class CreateUserImageDetailsTable1724314934136 {
  name = 'CreateUserImageDetailsTable1724314934136'

  async up(queryRunner) {
    await queryRunner.query(`
            CREATE TABLE \`image_details\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`image_id\` int NOT NULL,
                \`secure_url\` varchar(255) NOT NULL,
                \`gender\` int NOT NULL,
                \`age\` int NOT NULL,
                \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` timestamp NULL,
                PRIMARY KEY (\`id\`),
                CONSTRAINT \`FK_image_details_image\` FOREIGN KEY (\`image_id\`) REFERENCES \`images\`(\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE \`image_details\``);
  }
}
