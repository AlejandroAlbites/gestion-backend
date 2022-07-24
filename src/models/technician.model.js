const { Schema, model } = require("mongoose");

const technicianSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minlength: 4,
      maxlength: 20,
    },
    lastName: {
      type: String,
      required: [true, "lastName is required"],
      minlength: 4,
      maxlength: 30,
    },
    image: {
      type: String,
      default:
        "https://ceslava.s3-accelerate.amazonaws.com/2016/04/mistery-man-gravatar-wordpress-avatar-persona-misteriosa.png",
    },
    available: {
      type: String,
      default: "available",
    },
    role: {
      type: String,
      required: [true, "role is required"],
    },
    dni: {
      type: String,
      required: [true, "dni is required"],
      minlength: 8,
      maxlength: 10,
    },
    statistics: {
      type: Array,
      required: [true, "statistics is required"],
    },
    skills: {
      type: Array,
      default: [
        "Conocimiento",
        "Velocidad",
        "Liderazgo",
        "Sociabilidad",
        "Responsabilidad",
      ],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required to create a Technician"],
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Technician = model("Technician", technicianSchema);

module.exports = Technician;
