const { Schema, model } = require("mongoose");

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minlength: 4,
      maxlength: 20,
    },
    status: {
      type: String,
      default: "No Iniciado",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required to create a Project"],
    },
    groupsId: {
      type: [Schema.Types.ObjectId],
      ref: "Group",
    },
    techniciansId: {
      type: [Schema.Types.ObjectId],
      ref: "Technician",
    },
  },
  {
    timestamps: true,
  }
);

const Project = model("Project", projectSchema);

module.exports = Project;
