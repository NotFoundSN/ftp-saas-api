import db from "../database/models/index.js";

const validation = async (req, res, next) => {
	const apiKey = req.get("api-key");

	if (apiKey) {
		const permission = await db.Permission.findOne({
			where: {
				apiKey: apiKey,
			},
		});
		if (permission) {
			const temp = {
				folder: permission.folder,
			};
			req.folder = temp.folder;
			next();
		} else {
            // No existe el token
			return res.status(403).json({
				error: "Forbidden: Invalid API Key",
			});
		}
	} else {
        //No se ha enviado el token
		return res.status(401).json({
			error: "API Key is required",
		});
	}
};

export default validation;
