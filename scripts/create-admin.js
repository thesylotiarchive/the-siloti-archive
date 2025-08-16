const readline = require('readline');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  try {
    console.log('\n🛠️  Create Admin User');

    const username = await ask('Username: ');
    const email = await ask('Email: ');
    const password = await ask('Password: ');

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existing) {
      console.log('❌ User with this email or username already exists.');
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'SUPERADMIN',
      },
    });

    console.log('\n✅ Admin user created:');
    console.log(`🆔 ID: ${admin.id}`);
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Username: ${admin.username}`);
  } catch (err) {
    console.error('❌ Error creating admin:', err);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main();
