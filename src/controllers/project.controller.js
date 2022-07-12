const Project = require("../models/project.model");
const User = require("../models/user.model");
const Group = require("../models/group.model");

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
    res
      .status(404)
      .json({ ok: false, message: "project could not be create" });
  }
};

const list = async (req, res) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Invalid user");
    }

    const projects = await Project.find({ user: userId })
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
    const project = await Project.findById(id)
    // .populate(
    //   "Favs",
    //   "title description link"
    // );

    if (project.user.toString() !== user._id.toString()) {
      throw new Error("project does not belong to this user");
    }

    res
      .status(200)
      .json({ ok: true, message: "project found", data: project });
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

module.exports = {
  create,
  list,
  show,
  destroy,
};