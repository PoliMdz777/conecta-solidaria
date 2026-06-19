const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const dotenv   = require('dotenv');
dotenv.config();

const User       = require('./models/User');
const Necesidad  = require('./models/Necesidad');
const Donacion   = require('./models/Donacion');
const Voluntariado = require('./models/Voluntariado');
const Organizacion = require('./models/Organizacion');
const Notificacion = require('./models/Notificacion');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Conectado a MongoDB');

  // Limpiar colecciones
  await Promise.all([
    User.deleteMany(), Necesidad.deleteMany(), Donacion.deleteMany(),
    Voluntariado.deleteMany(), Organizacion.deleteMany(), Notificacion.deleteMany()
  ]);
  console.log('Colecciones limpiadas');

  // Crear usuarios
  const pass = await bcrypt.hash('password123', 10);
  const [admin, user1, user2] = await User.insertMany([
    { nombre: 'Admin Sistema', email: 'admin@conecta.com', passwordHash: pass, rol: 'admin', verificado: true },
    { nombre: 'María López',   email: 'maria@conecta.com', passwordHash: pass, rol: 'user',  verificado: true },
    { nombre: 'Carlos Ruiz',   email: 'carlos@conecta.com', passwordHash: pass, rol: 'user', verificado: false },
  ]);
  console.log('Usuarios creados');

  // Crear necesidades
  const necesidades = await Necesidad.insertMany([
    { titulo: 'Despensa para familias en Guadalupe', descripcion: 'Necesitamos apoyo con despensas básicas para 20 familias afectadas por las inundaciones recientes en la colonia. Cada despensa incluye arroz, frijol, aceite, atún y leche en polvo.', categoria: 'Alimentos', urgencia: 'alta',  meta: 20, progreso: 8,  solicitante: user1._id },
    { titulo: 'Ropa de invierno para niños',         descripcion: 'Buscamos donaciones de ropa abrigadora talla 2 a 10 para niños del albergue municipal. Se aceptan suéteres, chamarras y pantalones en buen estado.',                                    categoria: 'Ropa',      urgencia: 'media', meta: 50, progreso: 23, solicitante: user1._id },
    { titulo: 'Voluntarios para limpieza de parque', descripcion: 'Necesitamos 15 voluntarios el próximo sábado para rehabilitar el parque. Actividades: pintura de bancas, recolección de basura y siembra de plantas.',                                   categoria: 'Voluntariado', urgencia: 'baja', meta: 15, progreso: 6, solicitante: user2._id },
    { titulo: 'Medicamentos para adultos mayores',   descripcion: 'Casa hogar solicita medicamentos básicos: paracetamol, antiácidos, vendas y gasas para atender a 30 adultos mayores residentes.',                                                         categoria: 'Medicinas', urgencia: 'alta',  meta: 100, progreso: 40, solicitante: user1._id },
    { titulo: 'Útiles escolares para primaria',      descripcion: 'Colecta de cuadernos, lápices y colores para 30 niños de primaria en zona marginada del municipio de García.',                                                                            categoria: 'Otros',     urgencia: 'media', meta: 30, progreso: 12, solicitante: user2._id },
    { titulo: 'Alimentos para refugio animal',       descripcion: 'El refugio municipal necesita croquetas y alimento enlatado para más de 80 perros y gatos rescatados. Cualquier marca es bienvenida.',                                                   categoria: 'Alimentos', urgencia: 'alta',  meta: 200, progreso: 75, solicitante: user1._id },
  ]);
  console.log('Necesidades creadas');

  // Crear donaciones
  await Donacion.insertMany([
    { necesidad: necesidades[0]._id, colaborador: user2._id, descripcionArticulo: 'Arroz y frijol', cantidad: 5 },
    { necesidad: necesidades[1]._id, colaborador: user2._id, descripcionArticulo: 'Chamarras para niños', cantidad: 10 },
  ]);
  console.log('Donaciones creadas');

  // Crear voluntariados
  await Voluntariado.insertMany([
    { necesidad: necesidades[2]._id, colaborador: user2._id, horasOfrecidas: 4, fechaInicio: new Date('2026-06-21') },
  ]);
  console.log('Voluntariados creados');

  // Crear organización
  await Organizacion.create({
    nombre: 'Cruz Roja Guadalupe', direccion: 'Av. Principal 123, Guadalupe NL',
    telefono: '8112345678', responsable: user1._id, verificada: true,
  });
  console.log('Organización creada');

  // Crear notificaciones
  await Notificacion.insertMany([
    { usuario: user1._id, mensaje: 'Tu necesidad recibió una donación', tipo: 'donacion' },
    { usuario: user2._id, mensaje: 'Te registraste como voluntario exitosamente', tipo: 'voluntariado' },
  ]);
  console.log('Notificaciones creadas');

  console.log('\n✅ Seed completado exitosamente');
  console.log('Usuarios de prueba:');
  console.log('  Admin: admin@conecta.com / password123');
  console.log('  User:  maria@conecta.com / password123');
  mongoose.disconnect();
}

seed().catch((err) => { console.error(err); mongoose.disconnect(); });