const express = require("express");
const router = express.Router();
const saucesCtrl = require("../controllers/sauces");
const auth = require("../middleware/auth");
const isOwner = require("../middleware/isOwner");
const multer = require("../middleware/multer-config");

router.post("/", auth, multer, saucesCtrl.createSauce);
router.put("/:id", auth, isOwner, multer, saucesCtrl.updateSauce);
router.delete("/:id", auth, isOwner, saucesCtrl.deleteSauce);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.get("/", auth, saucesCtrl.getAllSauces);
router.post("/:id/like", auth, saucesCtrl.likeOrDislikeSauce);

module.exports = router;
