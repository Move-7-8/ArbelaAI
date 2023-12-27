import { Schema, model, models } from 'mongoose';

const threadSchema = new Schema({
    user: {
      type: String, 
      required: true,
        ref: 'User',
    },
  company: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  threadId: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
    },
  
});

const Thread = models.Thread || model("Thread", threadSchema);

export default Thread;
