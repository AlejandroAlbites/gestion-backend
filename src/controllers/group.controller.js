const Project = require("../models/project.model");
const Group = require("../models/group.model");
const User = require("../models/user.model");

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

    if (project.user.toString() !== user._id.toString()) {
      throw new Error("project does not belong to this user");
    }

    const group = await Group.create({ ...req.body });

    await Project.updateOne(
      { _id: project._id },
      {
        $push: { groupsId: group },
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
    console.log(groupId)
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }
    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error("Invalid group");
    }
    const project = await Project.findById(group.projectId);
    console.log(project)
    if (project.user.toString() !== user._id.toString()) {
      throw new Error("project does not belong to this user");
    }
    await Group.findByIdAndDelete(group._id);
    await Project.updateOne(
      { _id: project._id },
      {
        $pull: { groupsId: group._id },
      }
    );

    res.status(200).json({ ok: true, message: "group deleted", data: group });
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ ok: false, message: "group could not be deleted", data: err });
  }
};

module.exports = {
  create,
  list,
  show,
  destroy,
};