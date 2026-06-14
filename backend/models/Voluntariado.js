const mongoose = require('mongoose');

const voluntariadoSchema = new mongoose.Schema({
  necesidad:    { type: mongoose.Schema.Types.ObjectId, ref: 'Necesidad', required: true },
  colaborador:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  horasOfrecidas: { type: Number, required: true, min: 1 },
  fechaInicio:  { type: Date, required: true },
  estado:       { type: String, enum: ['pendiente','realizado','cancelado'], default: 'pendiente' },
}, { timestamps: true });

module.exports = mongoose.model('Voluntariado', voluntariadoSchema);