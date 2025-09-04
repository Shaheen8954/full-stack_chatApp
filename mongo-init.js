// Initialize database and create user
db = db.getSiblingDB('chatApp');
db.createUser({
  user: 'root',
  pwd: 'admin',
  roles: [
    {
      role: 'readWrite',
      db: 'chatApp',
    },
  ],
});

// Create initial collections
db.createCollection('users');
db.createCollection('messages');

print('MongoDB initialized with chatApp database and root user');
