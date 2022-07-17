const router = require("express").Router();
const {
  create,
  list,
  show,
  destroy,
  addOrRemoveTechnician,
  update,
  addOrRemoveTechnicianInProject,
} = require("../controllers/group.controller");
const { validateJWT } = require("../middlewares/validateJWT");

router.post("/project/group", validateJWT, create);
router.get("/project/groups/:projectId", validateJWT, list);
router.get("/project/group/:groupId", validateJWT, show);
router.delete("/project/group/:groupId", validateJWT, destroy);
router.put(
  "/project/group/:groupId/:technicianId",
  validateJWT,
  addOrRemoveTechnician
);
router.put(
  "/project/addTechnician/:groupId/:technicianId",
  validateJWT,
  addOrRemoveTechnicianInProject
);
router.put("/project/group/:groupId", validateJWT, update);

module.exports = router;
