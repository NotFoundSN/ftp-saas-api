import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import config from "../config/constants/indes.js";

// Configurar cliente de R2 usando la API compatible con S3
const r2Client = new S3Client({
	region: "auto", // R2 usa "auto" como región
	endpoint: config.R2_ENDPOINT,
	credentials: {
		accessKeyId: config.R2_ACCESS_KEY_ID,
		secretAccessKey: config.R2_SECRET_ACCESS_KEY,
	},
});

const uploadFile = async (file, path) => {
	let newpath = path;
	if (newpath.length > 0) {
		if (newpath[0] === "/") {
			newpath = newpath.substring(1).replaceAll("//", "/");
		}
	}
	
	const fileName = file?.originalname.replaceAll(" ", "_");
	const key = `${newpath}/${fileName}`.replaceAll("//", "/");
	
	try {
		const uploadParams = {
			Bucket: config.R2_BUCKET_NAME,
			Key: key,
			Body: file?.buffer,
			ContentType: file?.mimetype || "application/octet-stream",
		};

		const command = new PutObjectCommand(uploadParams);
		await r2Client.send(command);

		// Construir la URL pública del archivo
		const publicUrl = `${config.R2_PUBLIC_URL}/${key}`.replaceAll("//", "/").replaceAll(":/", "://");

		return {
			state: "success",
			file: file.originalname,
			path: publicUrl,
		};
	} catch (error) {
		console.error("Error al subir archivo a R2:");
		console.error(error);
		return {
			state: "error",
			file: file.originalname,
			error: error.message,
		};
	}
};

const deleteFile = async (path) => {
	try {
		// Extraer la key del path (remover la URL base)
		let key = path.replace(config.R2_PUBLIC_URL, "");
		if (key.startsWith("/")) {
			key = key.substring(1);
		}

		const deleteParams = {
			Bucket: config.R2_BUCKET_NAME,
			Key: key,
		};

		const command = new DeleteObjectCommand(deleteParams);
		await r2Client.send(command);

		return { 
			state: "success", 
			path: path 
		};
	} catch (error) {
		console.error("Error al borrar archivo de R2:");
		console.error(error);
		return { 
			state: "error", 
			path: path,
			error: error.message,
		};
	}
};

export default { uploadFile, deleteFile };
