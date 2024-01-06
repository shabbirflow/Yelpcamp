const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  location: { type: String, required: true },
  image: { type: String, required: true },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

CampgroundSchema.post("findOneAndDelete", async function (camp) {
  // console.log(camp, "HAS BEEN DELETED! POST MIDDLEWARE!")
  const res = await Review.deleteMany({ _id: { $in: camp.reviews } });
  console.log("YOUR REVIEWS ARE:");
  console.log(res, camp);
});

module.exports = mongoose.model("Campground", CampgroundSchema);
