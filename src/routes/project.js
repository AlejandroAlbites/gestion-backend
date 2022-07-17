const router = require("express").Router();
const {
  create,
  list,
  show,
  destroy,
  getProjectId,
} = require("../controllers/project.controller");
const { validateJWT } = require("../middlewares/validateJWT");

router.post("/project", validateJWT, create);
router.get("/project", validateJWT, list);
router.get("/project/:id", validateJWT, show);
router.get("/project/getproject/:id", validateJWT, getProjectId);
router.delete("/project/:id", validateJWT, destroy);

module.exports = router;
