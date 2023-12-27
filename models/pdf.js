import { Schema, model, models } from 'mongoose';

const pdfSchema = new Schema({
  url: {
    type: String,
    required: true,
    unique: true
  },
  company: {
    type: String,
    required: true
  },
  statementType: {
    type: String,
    required: true
  },
  docId: {  
    type: String,
    required: true,
    unique: true

  }
});

const pdf = models.pdf || model("pdf", pdfSchema);

export default pdf;
