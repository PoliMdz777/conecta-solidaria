const mongoose = require('mongoose');

const notificacionSchema = new mongoose.Schema({
  usuario:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mensaje:  { type: String, required: true },
  tipo:     { type: String, enum: ['donacion','voluntariado','sistema'], default: 'sistema' },
  leida:    { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notificacion', notificacionSchema);