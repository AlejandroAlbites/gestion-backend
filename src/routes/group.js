const router = require("express").Router();
const {
  create,
  list,
  show,
  destroy,
  addOrRemoveTechnician,
  update,
  addOrRemoveTechnicianInProject,
  updateStateGroup,
  updateOrderTechnicianInGroup,
  updateOrderGroupsInStatus,
  listGroupsUser,
} = require("../controllers/group.controller");
const { validateJWT } = require("../middlewares/validateJWT");

router.post("/project/group", validateJWT, create);
router.get("/project/groups/:projectId", validateJWT, list);
router.get("/groups", validateJWT, listGroupsUser);
router.get("/project/group/:groupId", validateJWT, show);
router.delete("/project/group/:groupId", validateJWT, destroy);
router.put(
  "/project/group/:startGroupId/:finishGroupId/:technicianId",
  validateJWT,
  addOrRemoveTechnician
);
router.put(
  "/project/addTechnician/:groupId/:technicianId",
  validateJWT,
  addOrRemoveTechnicianInProject
);
router.put("/project/group/:groupId/:score", validateJWT, update);
router.put(
  "/project/dragGroup/:startStateId/:finishStateId/:groupId",
  validateJWT,
  updateStateGroup
);
router.put(
  "/project/dragTechnician/:groupId/:technicianId/:startIndex/:finishIndex",
  validateJWT,
  updateOrderTechnicianInGroup
);
router.put(
  "/project/dragGroupInStatus/:statusId/:groupId/:startIndex/:finishIndex",
  validateJWT,
  updateOrderGroupsInStatus
);

module.exports = router;
