import mongoose from "mongoose";

const learningItemSchema = new mongoose.Schema(
  {
    skill: String,
    priority: Number,
    reason: String,
    resources: [
      {
        label: String,
        url: String
      }
    ],
    estimatedWeeks: Number
  },
  { _id: false }
);

const careerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume"
    },
    targetRole: {
      type: String,
      required: true
    },
    matchedSkills: {
      type: [String],
      default: []
    },
    missingSkills: {
      type: [String],
      default: []
    },
    priorityScore: {
      type: Number,
      default: 0
    },
    learningPath: {
      type: [learningItemSchema],
      default: []
    },
    aiSuggestions: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

const Career = mongoose.model("Career", careerSchema);

export default Career;
