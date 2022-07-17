const Project = require("../models/project.model");
const User = require("../models/user.model");
const Group = require("../models/group.model");
const Technician = require("../models/technician.model");

const create = async (req, res) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Invalid user");
    }
    const newProject = await Project.create({ ...req.body, user: user._id });

    await User.updateOne(
      { _id: user._id },
      {
        $push: { projectId: newProject },
      }
    );
    res
      .status(200)
      .json({ ok: true, message: "project created", data: newProject });
  } catch (err) {
    console.log(err);
    res.status(404).json({ ok: false, message: "project could not be create" });
  }
};

const list = async (req, res) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Invalid user");
    }

    const projects = await Project.find({ user: userId });
    // .populate(
    //   "Favs",
    //   "title description link"
    // );

    res
      .status(200)
      .json({ ok: true, message: "projects found", projects: projects });
  } catch (err) {
    res
      .status(404)
      .json({ ok: false, message: "projects not found", data: err });
  }
};

const show = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }
    const project = await Project.findById(id);
    // .populate(
    //   "Favs",
    //   "title description link"
    // );

    if (project.user.toString() !== user._id.toString()) {
      throw new Error("project does not belong to this user");
    }

    res.status(200).json({ ok: true, message: "project found", data: project });
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ ok: false, message: "project not found", data: err });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }
    const project = await Project.findById(id);

    if (project.user.toString() !== user._id.toString()) {
      throw new Error("project does not belong to this user");
    }
    // eliminacion en cascada
    const groups = await Group.find({ projectId: project._id });

    if (groups.length > 0) {
      await Group.deleteMany({ projectId: project._id });
    }
    await Project.findByIdAndDelete(project._id);
    await User.updateOne(
      { _id: user._id },
      {
        $pull: { projectId: project._id },
      }
    );

    res
      .status(200)
      .json({ ok: true, message: "project deleted", data: project });
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ ok: false, message: "project could not be deleted", data: err });
  }
};

const getProjectId = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }
    const project = await Project.findById(id);

    if (project.user.toString() !== user._id.toString()) {
      throw new Error("project does not belong to this user");
    }

    const allGroups = await Group.find({ projectId: project._id });
    const allTechnicians = await Technician.find({ projectId: project._id });

    let groups = {};
    allGroups.forEach((group) => {
      groups[group._id] = {
        id: group._id.toString(),
        title: group.name,
        techIds:
          group.techniciansId.length > 0
            ? group.techniciansId.toString().split(",")
            : group.techniciansId,
      };
    });

    let technicals = {};
    allTechnicians.forEach((tech) => {
      technicals[tech._id] = {
        id: tech._id.toString(),
        name: tech.name,
      };
    });

    const standByGroup = await Group.find({
      status: "En espera",
      projectId: project._id,
    });
    const standByGroupIds =
      standByGroup.length > 0
        ? standByGroup
            .map((group) => group._id)
            .toString()
            .split(",")
        : standByGroup.map((group) => group._id);

    const runGroup = await Group.find({
      status: "En ejecución",
      projectId: project._id,
    });
    const runGroupIds =
      runGroup.length > 0
        ? runGroup
            .map((group) => group._id)
            .toString()
            .split(",")
        : runGroup.map((group) => group._id);

    let status = {
      "status-1": {
        id: "status-1",
        title: "En espera",
        groupsIds: standByGroupIds,
      },
      "status-2": {
        id: "status-2",
        title: "En ejecución",
        groupsIds: runGroupIds,
      },
    };

    // Facilitate reordering of the status

    const initialState = {
      technicals,
      groups,
      status,
      statusOrder: ["status-1", "status-2"],
      projectId: project._id,
    };

    res.status(200).json({
      ok: true,
      message: "project found",
      data: initialState,
    });
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ ok: false, message: "project not found", data: err });
  }
};

module.exports = {
  create,
  list,
  show,
  destroy,
  getProjectId,
};
