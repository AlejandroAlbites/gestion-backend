const jwt = require("jsonwebtoken");

const generateJWT = (_id, name, email) => {
  return new Promise((resolve, reject) => {
    const payload = { _id, name, email };
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: "24h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("could not generate token");
        }
        resolve(token);
      }
    );
  });
};
module.exports = {
  generateJWT,
};
