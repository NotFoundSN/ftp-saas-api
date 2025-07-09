import { Router } from "express";
import middleware from "../middleware/auth.middleware.js";
import fileRouter from "./file.router.js";
import multer from "multer";
const upload = multer();
//import userRouter from "./user.router.js";
//import cartRouter from "./carts.router.js";

const router = Router();

router.get("/", (req, res) => {
	res.status(200).json({
		message: "Welcome to the FTP SaaS API",
	});
});

router.use("/file", upload.array("file"), middleware, fileRouter);

export default router;