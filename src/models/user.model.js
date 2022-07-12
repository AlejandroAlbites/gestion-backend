const { Schema, model, models } = require("mongoose");
const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const userSchema = new Schema(
  { 
    name: {
        type: String,
        required: [true, "name is required"]
    },
    company: {
        type: String,
        required: [true, "company is required"]
    },
    email: {
      type: String,
      required: [true, "email is required"],
      match: [emailRegex, "email is not valid"],
      validate: {
        async validator(email) {
          const user = await models.User.findOne({ email });
          return !user;
        },
        message: "email already exists",
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    logo: {
        type: String,
    },
    projectId: {
      type: [Schema.Types.ObjectId],
      ref: "Project",
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
