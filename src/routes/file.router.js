import { Router } from "express";
import files from "../utils/files.js";
import config from "../config/constants/indes.js";

const router = Router();

router.post("/", async (req, res) => {
	if (req.files.length == 0) {
		return res.status(400).json({ error: "No files uploaded" });
	}
	if (!req?.body?.path) {
		req.body.path = req.folder;
	} else {
		req.body.path = `${req.folder}/${req.body.path}`;
	}
	try {
		let temp = await files.uploadFile(req.files[0], req.body.path);
		if (temp.state == "success") {
			return res.status(200).json(temp);
		} else {
			return res.status(400).json(temp);
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
});
router.delete("/", async (req, res) => {
	if (!req?.body?.path) {
		return res.status(400).json({ error: "No path provided" });
	}
	if (!req.body.path.includes(req.folder)) {
		return res
			.status(403)
			.json({ error: "Forbidden: Cannot delete files outside of your assigned folder prefix" });
	}
	try {
		let deleteFilePath = req.body.path.replaceAll(
			config.R2_PUBLIC_URL,
			""
		);
		let deleteFile = await files.deleteFile(req.body.path);
		if (deleteFile.state == "success") {
			return res
				.status(204)
				.json({ message: "File deleted successfully", path: req.body.path });
		} else {
			return res
				.status(400)
				.json({ error: "Error deleting file", path: req.body.path });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
});
router.use("*", (req, res) => {
	res.status(404).json({
		error: "Ruta no encontrada",
	});
});

export default router;
