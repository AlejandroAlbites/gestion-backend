const Project = require("../models/project.model");
const Group = require("../models/group.model");
const User = require("../models/user.model");
const Technician = require("../models/technician.model");

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
    console.log(groupId);
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
  const groupId = req.params.groupId;
  const technicianId = req.params.technicianId;
  const { userId } = req;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error("Invalid group");
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

      const groupUpdate = await Group.findById(group._id);
      return res.status(200).json({
        ok: true,
        msg: "technical successfully added",
        group: groupUpdate,
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
      const groupUpdate = await Group.findById(group._id);
      return res.status(200).json({
        ok: true,
        msg: "technical successfully removed",
        group: groupUpdate,
      });
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
          // $push: { techniciansId: technician._id },
          projectId: project._id,
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
          // $push: { techniciansId: technician._id },
          projectId: null,
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
  try {
    const { groupId } = req.params;
    const { userId } = req;
    console.log(groupId);
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

    const groupUpdate = await Group.findByIdAndUpdate(group._id, req.body, {
      new: true,
      runValidators: true,
      context: "query",
    });
    res.status(200).json({
      ok: true,
      message: "group updated",
      data: groupUpdate,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: "group could not be update",
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
};
