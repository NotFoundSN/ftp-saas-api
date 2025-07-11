import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import { fileURLToPath, pathToFileURL } from "url";
import configData from "../config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const config = configData;
const db = {};

let sequelize = new Sequelize(
	config.database,
	config.username,
	config.password,
	config
);

const loadModels = async () => {
	const files = fs.readdirSync(__dirname).filter((file) => {
		return (
			file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
		);
	});

	for (const file of files) {
		const filePath = path.join(__dirname, file);
		try {
			const { default: defineModel } = await import(
				pathToFileURL(filePath).href
			);
			const model = defineModel(sequelize, DataTypes);
			db[model.name] = model;
		} catch (err) {
			console.error(`Error importing ${filePath}:`, err);
		}
	}

	Object.values(db).forEach((model) => {
		if (model.associate) {
			model.associate(db);
		}
	});

	db.sequelize = sequelize;
	db.Sequelize = Sequelize;
};

loadModels()
	.then(async () => {
		await sequelize.sync({
			/*alter: true,
			force: true,*/ // Cambia a true si quieres forzar la sincronización
		});
		console.log("Models loaded and associations set");
	})
	.catch((err) => {
		console.error("Error loading models:", err);
	});

export default db;
