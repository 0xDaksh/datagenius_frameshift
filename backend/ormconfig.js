module.exports = {
  type: 'mariadb',
  host: process.env.DB_HOST || '0.0.0.0',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || 'user',
  password: process.env.DB_PASS || 'pass',
  database: process.env.DB_NAME || 'db_name',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['__migrations__/*.ts'],
  cli: {
    migrationsDir: '__migrations__',
  },
  synchronize: true,
};
