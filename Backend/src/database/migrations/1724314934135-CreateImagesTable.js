const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class CreateImagesTable1724314934135 {
    name = 'CreateImagesTable1724314934135'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`images\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`origin_url\` varchar(255) NOT NULL,
                \`predicted_url\` varchar(255) NOT NULL,
                \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` timestamp NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE \`user_images\``);
        await queryRunner.query(`DROP TABLE \`images\``);
    }
}
