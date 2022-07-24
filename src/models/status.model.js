const { Schema, model } = require("mongoose");

const statusSchema = new Schema(
  {
    title: {
      type: String,
    },
    groupsIds: {
      type: [Schema.Types.ObjectId],
      ref: "Group",
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Status = model("Status", statusSchema);

module.exports = Status;
