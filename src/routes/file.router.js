import { Router } from "express";
import files from "../utils/files.js"

const router = Router();

router.get("/", (req,res) => {
    console.log(req.folder);
    console.log("hola mundo")
});
router.post("/", async (req,res) => {
    console.log(req.folder);
    console.log(req.files);
    console.log(req.body.path);
    console.log(req.body.name);
    let temp = await files.uploadFile(req.files[0], req.body.path, req.body.name);
    console.log(temp);
    console.log("hola mundo");
});
router.put("/", (req,res) => {
    console.log("hola mundo")
});
router.delete("/", (req,res) => {
    console.log("hola mundo")
});

export default router;