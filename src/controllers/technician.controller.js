const Technician = require("../models/technician.model");
const User = require("../models/user.model");
const Group = require("../models/group.model");
const Project = require("../models/project.model");

const create = async (req, res) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Invalid user");
    }
    const newTechnician = await Technician.create({
      ...req.body,
      user: user._id,
    });

    res.status(200).json({
      ok: true,
      message: "newTechnician created",
      data: newTechnician,
    });
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ ok: false, message: "newTechnician could not be create" });
  }
};

const list = async (req, res) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Invalid user");
    }

    const technicians = await Technician.find({ user: userId });

    res
      .status(200)
      .json({ ok: true, message: "technicians found", data: technicians });
  } catch (err) {
    res
      .status(404)
      .json({ ok: false, message: "technicians not found", data: err });
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
    const technician = await Technician.findById(id);

    if (technician.user.toString() !== user._id.toString()) {
      throw new Error("technician does not belong to this user");
    }

    res
      .status(200)
      .json({ ok: true, message: "technician found", data: technician });
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ ok: false, message: "technician not found", data: err });
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
    const technician = await Technician.findById(id);

    if (technician.user.toString() !== user._id.toString()) {
      throw new Error("technician does not belong to this user");
    }

    await Technician.findByIdAndDelete(technician._id);

    res
      .status(200)
      .json({ ok: true, message: "technician deleted", data: technician });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      ok: false,
      message: "technician could not be deleted",
      data: err,
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }
    const technician = await Technician.findById(id);

    if (technician.user.toString() !== user._id.toString()) {
      throw new Error("technician does not belong to this user");
    }

    const technicianUpdate = await Technician.findByIdAndUpdate(
      technician._id,
      req.body,
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );
    res.status(200).json({
      ok: true,
      message: "technician updated",
      data: technicianUpdate,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: "technician could not be update",
      data: err.message,
    });
  }
};

module.exports = {
  create,
  list,
  show,
  destroy,
  update,
};
