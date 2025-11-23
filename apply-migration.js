const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function applyMigration() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'file:./prisma/dev.db'
      }
    }
  });
  
  try {
    // Execute the SQL migration line by line
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'prisma/migrations/20251123181300_add_suggestion_model/migration.sql'),
      'utf8'
    );
    
    const statements = migrationSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await prisma.$executeRawUnsafe(statement.trim() + ';');
      }
    }
    
    console.log('Migration applied successfully!');
  } catch (error) {
    console.error('Error applying migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

applyMigration();