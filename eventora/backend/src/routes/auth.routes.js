const router = require("express").Router();
const { register, login, me, updateProfile, changePassword } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.patch("/me", protect, updateProfile);
router.patch("/me/password", protect, changePassword);

module.exports = router;
