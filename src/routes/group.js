const router = require("express").Router();
const {
  create,
  list,
  show,
  destroy,
} = require("../controllers/group.controller");
const { validateJWT } = require("../middlewares/validateJWT");

router.post("/project/group", validateJWT, create);
router.get("/project/groups/:projectId", validateJWT, list);
router.get("/project/group/:groupId", validateJWT, show);
router.delete("/project/group/:groupId", validateJWT, destroy);

module.exports = router;