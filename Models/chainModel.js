const mongoose = require('mongoose');

const chainSchema = mongoose.Schema({
  chain: {
    type: Object,
  },
});

const Chain = mongoose.model('Chain', chainSchema);

module.exports = Chain;
