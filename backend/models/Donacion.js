const mongoose = require('mongoose');

const donacionSchema = new mongoose.Schema({
  necesidad:         { type: mongoose.Schema.Types.ObjectId, ref: 'Necesidad', required: true },
  colaborador:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tipo:              { type: String, enum: ['articulo'], default: 'articulo' },
  descripcionArticulo: { type: String, required: true },
  cantidad:          { type: Number, required: true, min: 1 },
}, { timestamps: true });

module.exports = mongoose.model('Donacion', donacionSchema);