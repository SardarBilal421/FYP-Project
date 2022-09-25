const mongoose = require('mongoose');

const templateSchema = mongoose.Schema({
  cardKey: {
    type: Number,
  },
  image: {
    type: String,
    required: [true, 'A Tempalte must have Image!'],
  },
  title: {
    type: String,
    required: [true, 'A Tempalte must have Image!'],
  },
  desc: {
    type: String,
    required: [true, 'A Tempalte must have Image!'],
  },
});

const AgrementTemplate = mongoose.model('AgrementTemplate', templateSchema);
const UnderTakingTemplate = mongoose.model(
  'UnderakingTemplate',
  templateSchema
);

module.exports = { AgrementTemplate, UnderTakingTemplate };
