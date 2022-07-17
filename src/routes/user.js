const router = require("express").Router();
const {
  register,
  login,
  tokenRevalidate,
  show,
} = require("../controllers/user.controller");
const { validateJWT } = require("../middlewares/validateJWT");

router.post("/register", register);
router.post("/login", login);
router.get("/user", validateJWT, show);
router.get("/renew", validateJWT, tokenRevalidate);

module.exports = router;
