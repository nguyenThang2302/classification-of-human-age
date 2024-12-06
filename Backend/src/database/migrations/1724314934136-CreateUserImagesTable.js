const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class CreateUserImagesTable1724314934136 {
    name = 'CreateUserImagesTable1724314934136'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`user_images\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`image_id\` int NOT NULL,
                \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` timestamp NULL,
                PRIMARY KEY (\`id\`),
                CONSTRAINT \`FK_user_images_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`FK_user_images_image\` FOREIGN KEY (\`image_id\`) REFERENCES \`images\`(\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE \`user_images\``);
    }
}
