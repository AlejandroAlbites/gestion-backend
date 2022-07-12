const router = require("express").Router();
const {
  create,
  list,
  show,
  destroy,
} = require("../controllers/technician.controller");
const { validateJWT } = require("../middlewares/validateJWT");

router.post("/technician", validateJWT, create);
router.get("/technician", validateJWT, list);
router.get("/technician/:id", validateJWT, show);
router.delete("/technician/:id", validateJWT, destroy);

module.exports = router;