import config from "../../config/constants/indes.js";

export default {
	username: config.DB_USERNAME,
	password: config.DB_PASSWORD,
	database: config.DB_NAME,
	host: config.DB_HOST,
	port: config.DB_PORT,
	dialect: config.DB_DIALECT,
	schema: config.DB_SCHEMA || "files", // Default schema for PostgreSQL
	dialectOptions: {
		connectTimeout: 120000,
	},
	logging: config.SEQUELIZE_LOGGING,
	query: {
		raw: config.SEQUELIZE_RAW_QUERIES,
	},
};