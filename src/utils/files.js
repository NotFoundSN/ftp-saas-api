import stream from "node:stream";
import ftp from "basic-ftp";
import config from "../config/constants/indes.js";

const ftpServer = {
	host: config.FTP_HOST,
	user: config.FTP_USER,
	password: config.FTP_PASSWORD,
	port: config.FTP_PORT,
	secure: false, // o true para FTPS
	passive: true, // ¡Activa el modo pasivo!
};

const url = {
	publicBaseUrl: config.PUBLIC_URL,
	privateBaseUrl: config.PRIVATE_URL,
};

const uploadFile = async (file, path) => {
	const client = new ftp.Client();
	let newpath = path;
	if (newpath.length > 0) {
		if (newpath[0] === "/") {
			newpath = newpath.substring(1).replaceAll("//", "/");
		}
	}
	const name = file?.originalname.replaceAll(" ", "_");
	try {
		let dir = "";
		// crea la conexion al servidor FTP
		await client.access({
			...ftpServer,
		});
		// crea la carpeta si no existe
		await client.ensureDir(`${url.privateBaseUrl}/${newpath}`);
		dir = `${url.privateBaseUrl}/${newpath}`;

		// convierte el archivo en stream
		const readableStream = stream.Readable.from(file?.buffer);

		// sube el archivo al servidor FTP
		await client.uploadFrom(readableStream, `${dir}/${name}`);
	} catch (error) {
		console.error("Error al subir archivo");
		console.error(error);
		client.close();
		return {
			state: "error",
			file: `${file.originalname}`,
		};
	}
	client.close();
	return {
		state: "success",
		file: `${file.originalname}`,
		path: `${url.publicBaseUrl}${newpath}/${name}`
			.replaceAll("//", "/")
			.replaceAll(":/", "://"),
	};
};

const deleteFile = async (path) => {
	const client = new ftp.Client();
	try {
		await client.access({
			...ftpServer,
		});
		let tryRemove = await client.remove(path);
		client.close();
		if (tryRemove.code == 250) {
			return { state: "success", path: path };
		} else {
			return { state: "error", path: path };
		}
	} catch (error) {
		client.close();
		console.error("Error al borrar archivo");
		console.error(error);
		return { state: "error", path: path };
	}
};

export default { uploadFile, deleteFile };
