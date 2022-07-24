const Project = require("../models/project.model");
const User = require("../models/user.model");
const Group = require("../models/group.model");
const Technician = require("../models/technician.model");
const Status = require("../models/status.model");

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

    await Status.create({
      title: "En espera",
      projectId: newProject,
    });
    await Status.create({
      title: "En ejecución",
      projectId: newProject,
    });
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
    const technicians = await Technician.find({ projectId: project._id });
    const status = await Status.find({ projectId: project._id });

    if (status.length > 0) {
      await Status.deleteMany({ projectId: project._id });
    }
    if (groups.length > 0) {
      await Group.deleteMany({ projectId: project._id });
    }

    if (technicians.length > 0) {
      await Technician.updateMany(
        { projectId: project._id },
        {
          projectId: null,
          groupId: null,
        }
      );
    }
    await User.updateOne(
      { _id: user._id },
      {
        $pull: { projectId: project._id },
      }
    );
    await Project.findByIdAndDelete(project._id);
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
    const allStatus = await Status.find({ projectId: project._id });

    let status = {};
    allStatus.forEach((state) => {
      status[state._id] = {
        id: state._id.toString(),
        title: state.title,
        groupsIds:
          state.groupsIds.length > 0
            ? state.groupsIds.toString().split(",")
            : state.groupsIds,
      };
    });

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

    const initialState = {
      technicals,
      groups,
      status,
      statusOrder: [allStatus[0]._id.toString(), allStatus[1]._id.toString()],
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
