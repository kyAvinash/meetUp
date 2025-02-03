const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true,
  },
  date:{
    type: Date,
    required: true,
  },
  type:{
    type: String,
    enum: ["Online", "Offline", "Both"],
    default: "Both",
  },
  thumbnail:{
    type: String,
    required: true,
  },
  description:{
    type: String,
    required: true,
  },
  topics:{
    type: String,
    required: true,
  },
  sessionTimings: {
    startTime: String,
    endTime: String,
  },
  speakers:[{
    name: String,
    bio: String,
    image: String,
  }],
  pricing: {
    type: Number,
  },
  venue:{
    type: String,
  },
  address:{
    type: String,
  },
  additionalInfo:[{
    dressCode: String,
    ageRestriction: String,
  }],
  tags: [{
    type: String,
  }]
},{timestamps:true});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;