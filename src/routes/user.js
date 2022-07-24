const router = require("express").Router();
const {
  register,
  login,
  tokenRevalidate,
  show,
  updateUser,
  changePassword,
} = require("../controllers/user.controller");
const { validateJWT } = require("../middlewares/validateJWT");
const { route } = require("./group");

router.post("/register", register);
router.post("/login", login);
router.get("/user", validateJWT, show);
router.get("/renew", validateJWT, tokenRevalidate);
router.put("/edit", validateJWT, updateUser);
router.put("/change-password", validateJWT, changePassword);

module.exports = router;
