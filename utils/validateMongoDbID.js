import mongoose from "mongoose";

const validateMongoDbID = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid) {
    throw new Error("This Id is not valid or found");
  }
};

export default validateMongoDbID;
