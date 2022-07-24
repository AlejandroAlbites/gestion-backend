const Project = require("../models/project.model");
const Group = require("../models/group.model");
const User = require("../models/user.model");
const Technician = require("../models/technician.model");
const Status = require("../models/status.model");

const create = async (req, res) => {
  try {
    const { projectId } = req.body;
    const { userId } = req;

    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error("Invalid project");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }

    const statusProject = await Status.find({ projectId: projectId });
    const standByStatus = statusProject.find(
      (status) => status.title === "En espera"
    );
    if (project.user.toString() !== user._id.toString()) {
      throw new Error("project does not belong to this user");
    }

    const group = await Group.create({ ...req.body, user: user._id });

    await Project.updateOne(
      { _id: project._id },
      {
        $push: { groupsId: group },
      }
    );
    await Status.updateOne(
      { _id: standByStatus._id },
      {
        $push: { groupsIds: group },
      }
    );
    res.status(200).json({ ok: true, message: "group created", data: group });
  } catch (err) {
    console.log(err);
    res.status(404).json({ ok: false, message: "group could not be create" });
  }
};

const list = async (req, res) => {
  try {
    const { userId } = req;
    const { projectId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }
    const project = await Project.findById(projectId);

    if (project.user.toString() !== user._id.toString()) {
      throw new Error("project does not belong to this user");
    }

    const groups = await Group.find({ projectId: projectId });

    res.status(200).json({ ok: true, message: "groups found", groups: groups });
  } catch (err) {
    console.log(err);
    res.status(404).json({ ok: false, message: "groups not found", data: err });
  }
};
const listGroupsUser = async (req, res) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }

    const AllGroups = await Group.find({ user: userId });

    res
      .status(200)
      .json({ ok: true, message: "groups found", AllGroups: AllGroups });
  } catch (err) {
    console.log(err);
    res.status(404).json({ ok: false, message: "groups not found", data: err });
  }
};

const show = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }
    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error("Invalid group");
    }
    const project = await Project.findById(group.projectId);

    if (project.user.toString() !== user._id.toString()) {
      throw new Error("project does not belong to this user");
    }

    res.status(200).json({ ok: true, message: "group found", data: group });
  } catch (err) {
    console.log(err);
    res.status(404).json({ ok: false, message: "group not found", data: err });
  }
};

const destroy = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }
    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error("Invalid group");
    }
    const project = await Project.findById(group.projectId);

    if (project.user.toString() !== user._id.toString()) {
      throw new Error("project does not belong to this user");
    }

    if (group.techniciansId.length === 0) {
      await Group.findByIdAndDelete(group._id);
      await Project.updateOne(
        { _id: project._id },
        {
          $pull: { groupsId: group._id },
        }
      );

      res.status(200).json({ ok: true, message: "group deleted", data: group });
    } else {
      res.status(400).json({
        ok: false,
        message:
          "the group could not be deleted with the technicians included in its array",
      });
    }
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ ok: false, message: "group could not be deleted", data: err });
  }
};

const addOrRemoveTechnician = async (req, res) => {
  const startGroupId = req.params.startGroupId;
  const finishGroupId = req.params.finishGroupId;
  const technicianId = req.params.technicianId;
  const { userId } = req;

  try {
    const startGroup = await Group.findById(startGroupId);
    if (!startGroup) {
      throw new Error("Invalid group");
    }
    const finishGroup = await Group.findById(finishGroupId);
    if (!finishGroup) {
      throw new Error("Invalid group");
    }
    if (startGroup.projectId !== finishGroup.projectId) {
      throw new Error("The groups doesn't in same project");
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }
    const technician = await Technician.findById(technicianId);
    if (!technician) {
      throw new Error("Invalid technician");
    }
    const findTechnical = startGroup.techniciansId.includes(technician._id);
    if (findTechnical) {
      await Group.updateOne(
        { _id: startGroup._id },
        {
          $pull: { techniciansId: technician._id },
        }
      );
      await Group.updateOne(
        { _id: finishGroup._id },
        {
          $push: { techniciansId: technician._id },
        }
      );
      const startGroupUpdate = await Group.findById(startGroup._id);
      const finishGroupUpdate = await Group.findById(finishGroup._id);
      return res.status(200).json({
        ok: true,
        msg: "technical successfully drag",
        startGroupUpdate,
        finishGroupUpdate,
      });
    } else {
      throw new Error("Technician does not found in start group");
    }
  } catch (err) {
    console.log(err);
  }
};

const addOrRemoveTechnicianInProject = async (req, res) => {
  const groupId = req.params.groupId;
  const technicianId = req.params.technicianId;
  const { userId } = req;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error("Invalid group");
    }
    const project = await Project.findById(group.projectId);
    if (!project) {
      throw new Error("Invalid project");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }

    const technician = await Technician.findById(technicianId);
    if (!technician) {
      throw new Error("Invalid technician");
    }

    const findTechnical = group.techniciansId.includes(technician._id);

    if (!findTechnical) {
      await Group.updateOne(
        { _id: group._id },
        {
          $push: { techniciansId: technician._id },
        }
      );
      await Project.updateOne(
        { _id: project._id },
        {
          $push: { techniciansId: technician._id },
        }
      );
      await Technician.updateOne(
        { _id: technician._id },
        {
          projectId: project._id,
          groupId: group._id,
        }
      );

      const projectUpdate = await Project.findById(project._id);
      return res.status(200).json({
        ok: true,
        msg: "technical successfully added",
        project: projectUpdate,
      });
    } else {
      await Group.updateOne(
        { _id: group._id },
        {
          $pull: {
            techniciansId: technician._id,
          },
        }
      );
      await Project.updateOne(
        { _id: project._id },
        {
          $pull: { techniciansId: technician._id },
        }
      );
      await Technician.updateOne(
        { _id: technician._id },
        {
          projectId: null,
          groupId: null,
        }
      );
      const projectUpdate = await Project.findById(project._id);
      return res.status(200).json({
        ok: true,
        msg: "technical successfully removed",
        project: projectUpdate,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const update = async (req, res) => {
  const groupId = req.params.groupId;
  const score = req.params.score;
  const { userId } = req;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }
    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error("Invalid group");
    }
    const project = await Project.findById(group.projectId);

    if (project.user.toString() !== user._id.toString()) {
      throw new Error("project does not belong to this user");
    }

    await Group.updateOne(
      { _id: group._id },
      {
        $push: { score: score },
      }
    );
    const groupUpdate = await Group.findById(group._id);
    res.status(200).json({
      ok: true,
      message: "score updated",
      data: groupUpdate,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: "score could not be update",
      data: err.message,
    });
  }
};

const updateStateGroup = async (req, res) => {
  const startStateId = req.params.startStateId;
  const finishStateId = req.params.finishStateId;
  const groupId = req.params.groupId;
  const { userId } = req;

  try {
    const startState = await Status.findById(startStateId);
    if (!startState) {
      throw new Error("Invalid state");
    }
    const finishState = await Status.findById(finishStateId);
    if (!finishState) {
      throw new Error("Invalid state");
    }

    if (startState.projectId.toString() !== finishState.projectId.toString()) {
      throw new Error("The state doesn't in same project");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }
    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error("Invalid group");
    }

    const findGroup = startState.groupsIds.includes(group._id);
    if (findGroup) {
      await Status.updateOne(
        { _id: startState._id },
        {
          $pull: { groupsIds: group._id },
        }
      );
      await Status.updateOne(
        { _id: finishState._id },
        {
          $push: { groupsIds: group._id },
        }
      );

      const allStatus = await Status.find({ projectId: group.projectId });
      const actionStatus = allStatus.find(
        (item) => item.title === "En ejecución"
      );

      const findGroupToChangeState = actionStatus.groupsIds.includes(group._id);
      if (findGroupToChangeState) {
        await Group.updateOne(
          { _id: group._id },
          {
            status: "En ejecución",
          }
        );
      } else {
        await Group.updateOne(
          { _id: group._id },
          {
            status: "En espera",
            $push: { tasks: `${group.tasks.length + 1}` },
          }
        );
      }
      const startStatusUpdate = await Status.findById(startState._id);
      const finishStatusUpdate = await Status.findById(finishState._id);
      const groupUpdate = await Group.findById(group._id);
      return res.status(200).json({
        ok: true,
        msg: "group successfully drag",
        startStatusUpdate,
        finishStatusUpdate,
        groupUpdate,
      });
    } else {
      throw new Error("group does not found in start status");
    }
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: "group could not be update",
      data: err.message,
    });
  }
};

const updateOrderTechnicianInGroup = async (req, res) => {
  const groupId = req.params.groupId;
  const technicianId = req.params.technicianId;
  const startIndex = req.params.startIndex;
  const finishIndex = req.params.finishIndex;

  const { userId } = req;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }
    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error("Invalid group");
    }
    const technician = await Technician.findById(technicianId);
    if (!technician) {
      throw new Error("Invalid technician");
    }

    const newTechOrderIds = group.techniciansId;

    newTechOrderIds.splice(startIndex, 1);
    newTechOrderIds.splice(finishIndex, 0, technicianId);

    await Group.updateOne(
      { _id: group._id },
      {
        techniciansId: newTechOrderIds,
      }
    );
    const groupUpdate = await Group.findById(group._id);
    res.status(200).json({
      ok: true,
      msg: "the technicians order was successfully changed",
      groupUpdate,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: "technician order could not be update",
      data: err.message,
    });
  }
};

const updateOrderGroupsInStatus = async (req, res) => {
  const statusId = req.params.statusId;
  const groupId = req.params.groupId;
  const startIndex = req.params.startIndex;
  const finishIndex = req.params.finishIndex;

  const { userId } = req;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }
    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error("Invalid group");
    }
    const status = await Status.findById(statusId);
    if (!status) {
      throw new Error("Invalid status");
    }

    const newGroupsOrderIds = status.groupsIds;

    newGroupsOrderIds.splice(startIndex, 1);
    newGroupsOrderIds.splice(finishIndex, 0, groupId);

    await Status.updateOne(
      { _id: status._id },
      {
        groupsIds: newGroupsOrderIds,
      }
    );
    const statusUpdate = await Status.findById(status._id);
    res.status(200).json({
      ok: true,
      msg: "the groups order was successfully changed",
      statusUpdate,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: "group order could not be update",
      data: err.message,
    });
  }
};

module.exports = {
  create,
  list,
  show,
  destroy,
  addOrRemoveTechnician,
  addOrRemoveTechnicianInProject,
  update,
  updateStateGroup,
  updateOrderTechnicianInGroup,
  updateOrderGroupsInStatus,
  listGroupsUser,
};
