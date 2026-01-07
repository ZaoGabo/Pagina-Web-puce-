const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  await prisma.pedidoDetalle.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.usuario.deleteMany();

  // Crear usuarios
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const userPassword = await bcrypt.hash('User123!', 10);

  const admin = await prisma.usuario.create({
    data: {
      email: 'admin@zaoshop.com',
      passwordHash: adminPassword,
      role: 'admin'
    }
  });

  const user = await prisma.usuario.create({
    data: {
      email: 'user@zaoshop.com',
      passwordHash: userPassword,
      role: 'user'
    }
  });

  console.log('Usuarios creados:', { admin: admin.email, user: user.email });

  // Crear productos (datos del catalogo original)
  const productos = await prisma.producto.createMany({
    data: [
      {
        nombre: 'Smartphone XR Pro',
        descripcion: 'Ultimo modelo con camara de 48MP, bateria de larga duracion y pantalla OLED de 6.4 pulgadas.',
        precio: 599.99,
        stock: 14,
        categoria: 'Electronica',
        imagen: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop'
      },
      {
        nombre: 'Laptop Gaming Ultra',
        descripcion: 'Procesador Intel i7, 16GB RAM, tarjeta grafica RTX 3060 y pantalla de 15.6 a 144Hz.',
        precio: 1299.99,
        stock: 5,
        categoria: 'Electronica',
        imagen: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=400&fit=crop'
      },
      {
        nombre: 'Auriculares Bluetooth',
        descripcion: 'Cancelacion de ruido activa, modo transparencia y autonomia de hasta 24 horas con estuche.',
        precio: 149.99,
        stock: 20,
        categoria: 'Electronica',
        imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop'
      },
      {
        nombre: 'Camiseta Premium',
        descripcion: '100% algodon organico, costuras reforzadas y disponible en tallas S a XXL.',
        precio: 29.99,
        stock: 30,
        categoria: 'Ropa',
        imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop'
      },
      {
        nombre: 'Zapatillas Deportivas',
        descripcion: 'Maxima comodidad y soporte para entrenamientos intensos, con tecnologia de amortiguacion avanzada.',
        precio: 89.99,
        stock: 18,
        categoria: 'Ropa',
        imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop'
      },
      {
        nombre: 'Lampara LED Inteligente',
        descripcion: 'Control por voz y aplicacion movil, 16 millones de colores y programacion de escenas.',
        precio: 45.99,
        stock: 25,
        categoria: 'Hogar',
        imagen: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=400&fit=crop'
      }
    ]
  });

  console.log(`${productos.count} productos creados.`);

  console.log('Seed completado exitosamente!');
  console.log('');
  console.log('Credenciales de prueba:');
  console.log('  Admin: admin@zaoshop.com / Admin123!');
  console.log('  Usuario: user@zaoshop.com / User123!');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
