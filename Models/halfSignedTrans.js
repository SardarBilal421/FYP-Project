const mongoose = require('mongoose');

const halfSignTransSchema = mongoose.Schema({
  transaction: {
    type: Object,
  },
});

const HalfSignTrans = mongoose.model('HalfSignTrans', halfSignTransSchema);

module.exports = HalfSignTrans;
