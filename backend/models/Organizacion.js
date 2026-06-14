const mongoose = require('mongoose');

const organizacionSchema = new mongoose.Schema({
  nombre:       { type: String, required: true, trim: true },
  direccion:    { type: String, required: true },
  telefono:     { type: String, required: true },
  responsable:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  verificada:   { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Organizacion', organizacionSchema);