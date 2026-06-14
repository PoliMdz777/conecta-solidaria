const mongoose = require('mongoose');

const necesidadSchema = new mongoose.Schema({
  titulo:      { type: String, required: true, trim: true },
  descripcion: { type: String, required: true },
  categoria:   { type: String, enum: ['Alimentos','Ropa','Medicinas','Voluntariado','Otros'], required: true },
  urgencia:    { type: String, enum: ['alta','media','baja'], default: 'media' },
  meta:        { type: Number, required: true, min: 1 },
  progreso:    { type: Number, default: 0 },
  estado:      { type: String, enum: ['abierta','cerrada'], default: 'abierta' },
  solicitante: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Necesidad', necesidadSchema);