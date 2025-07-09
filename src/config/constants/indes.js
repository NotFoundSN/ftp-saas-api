const config = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,

	DB_HOST: process.env.DB_HOST || "localhost",
	DB_PORT: process.env.DB_PORT || 5432,
	DB_NAME: process.env.DB_NAME || "db_name",
	DB_SCHEMA: process.env.DB_SCHEMA || "public",
	DB_DIALECT: process.env.DB_DIALECT || "postgres",
	DB_USERNAME: process.env.DB_USERNAME || "user",
	DB_PASSWORD: process.env.DB_PASSWORD || "password",

	SEQUELIZE_LOGGING: true,
	SEQUELIZE_RAW_QUERIES: true,

	FTP_HOST: process.env.FTP_HOST || "localhost",
	FTP_PORT: process.env.FTP_PORT || 21,
	FTP_USER: process.env.FTP_USER || "anonymous",
	FTP_PASSWORD: process.env.FTP_PASSWORD || "anonymous",

	PUBLIC_URL: process.env.PUBLIC_URL || "http://localhost:3000",
	PRIVATE_URL: process.env.PRIVATE_URL || "/public_html",
};

export default config;
