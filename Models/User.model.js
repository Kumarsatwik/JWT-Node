const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  try {
    console.log("called before saving a user");
    const salt = await bcrypt.genSalt(10);
    // console.log(this.email, this.password);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

// UserSchema.post("save", async function (next){
//     try{
//         console.log("called after saving a user")

//     }catch(err){
//         next(err)
//     }
// });

UserSchema.methods.isValidPassword = async function (password) {
  try {
    // console.log("password", password);
    // console.log("this password", this.password);
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw err;
  }
};

const User = mongoose.model("user", UserSchema);
module.exports = User;
