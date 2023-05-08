const mongoose = require('mongoose');

const halfSignTransSchema = mongoose.Schema({
  transaction: {
    type: Object,
  },
  status:{
    type:String,
    enum: ['Minted', 'Drafted']
  }
});

const HalfSignTrans = mongoose.model('HalfSignTrans', halfSignTransSchema);

module.exports = HalfSignTrans;
