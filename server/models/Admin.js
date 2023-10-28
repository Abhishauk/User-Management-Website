import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    }
  }
);
  

const AdminUser = mongoose.model("AdminUser", UserSchema);
export default AdminUser;
