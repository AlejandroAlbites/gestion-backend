const { Schema, model } = require("mongoose");

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minlength: 4,
      maxlength: 20,
    },
    description: {
      type: String,
      // required: [true, "description is required"],
      // minlength: 4,
      // maxlength: 30,
    },
    status: {
      type: String,
      default: "En espera",
    },
    score: {
      type: Array,
    },
    tasks: {
      type: Array,
    },
    statistics: {
      type: Array,
    },
    techniciansId: {
      type: [Schema.Types.ObjectId],
      ref: "Technician",
    },
    projectId: {
      type: String,
      required: [true, "User is required to create a Project"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required to create a group"],
    },
  },
  {
    timestamps: true,
  }
);

const Group = model("Group", groupSchema);

module.exports = Group;
