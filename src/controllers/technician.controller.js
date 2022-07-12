const Technician = require("../models/technician.model");
const User = require("../models/user.model");

const create = async (req, res) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Invalid user");
    }
    const newTechnician = await Technician.create({ ...req.body, user: user._id });

    // await User.updateOne(
    //   { _id: user._id },
    //   {
    //     $push: { projectId: newProject },
    //   }
    // );
    res
      .status(200)
      .json({ ok: true, message: "newTechnician created", data: newTechnician });
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

    const technicians = await Technician.find({ user: userId })
    // .populate(
    //   "Favs",
    //   "title description link"
    // );

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
    const technician = await Technician.findById(id)
    // .populate(
    //   "Favs",
    //   "title description link"
    // );

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
    // await User.updateOne(
    //   { _id: user._id },
    //   {
    //     $pull: { projectId: project._id },
    //   }
    // );

    res
      .status(200)
      .json({ ok: true, message: "technician deleted", data: technician });
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ ok: false, message: "technician could not be deleted", data: err });
  }
};

module.exports = {
  create,
  list,
  show,
  destroy,
};