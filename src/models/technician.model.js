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
        'https://ceslava.s3-accelerate.amazonaws.com/2016/04/mistery-man-gravatar-wordpress-avatar-persona-misteriosa.png',
    },
    available: {
      type: String,
      default: 'available',
    },
    role: {
      type: String,
      required: [true, "role is required"],
    },
    statistics: {
        type: Array,
      },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required to create a Technician"],
      },
    // projectId: {
    //     type: String,
    //     required: [true, "User is required to create a Project"],
    //   },
  },
  {
    timestamps: true,
  }
);

const Technician = model("Technician", technicianSchema);

module.exports = Technician;
