const router = require("express").Router();
const {
  create,
  list,
  show,
  destroy,
  update,
} = require("../controllers/technician.controller");
const { validateJWT } = require("../middlewares/validateJWT");

router.post("/technician", validateJWT, create);
router.get("/technician", validateJWT, list);
router.get("/technician/:id", validateJWT, show);
router.delete("/technician/:id", validateJWT, destroy);
router.put("/technician/:id", validateJWT, update);

module.exports = router;