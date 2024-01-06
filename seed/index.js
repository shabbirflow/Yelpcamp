const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

main()
  .then(() => {
    console.log("WE ARE CONNECTED!");
  })
  .catch((error) => {
    console.log("Some ERROR!!");
    console.log(error);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
}

const seedStuff = async () => {
  await Campground.deleteMany({});
  for(let i = 0; i<20; i++){
    const random1000 = Math.floor(Math.random() * 1000);
    const newOne = new Campground({
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${randomItem(descriptors)} ${randomItem(places)}`,
        image:  "https://source.unsplash.com/collection/1319040",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.",
        price: random1000/10,
        owner: '6597a8a138d3a6b95a96a890'

    })
    await newOne.save();
  }
  
};

seedStuff().then(()=>{
    mongoose.connection.close();
});

const randomItem = (array) => {
    return array[Math.floor(Math.random()*array.length)];
}