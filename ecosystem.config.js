/**
 * PM2 Ecosystem Configuration
 * Cluster Mode para aprovechar todos los cores del CPU
 * 
 * Uso:
 * - Desarrollo: pm2 start ecosystem.config.js --only gateway
 * - Producción: pm2 start ecosystem.config.js --env production
 * - Ver logs: pm2 logs
 * - Reiniciar: pm2 restart all
 * - Detener: pm2 stop all
 */

module.exports = {
  apps: [
    {
      name: 'gateway',
      script: './services/gateway/dist/main.js',
      instances: 'max', // Usa todos los cores disponibles
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: './logs/gateway-error.log',
      out_file: './logs/gateway-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
    {
      name: 'eventos',
      script: './services/eventos/dist/main.js',
      instances: 2, // 2 instancias para balanceo
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3002,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
      error_file: './logs/eventos-error.log',
      out_file: './logs/eventos-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
    },
    {
      name: 'inscriptions',
      script: './services/inscriptions/dist/main.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3003,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3003,
      },
      error_file: './logs/inscriptions-error.log',
      out_file: './logs/inscriptions-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
    },
    {
      name: 'teams',
      script: './services/teams/dist/main.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3004,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3004,
      },
      error_file: './logs/teams-error.log',
      out_file: './logs/teams-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
    },
    {
      name: 'matches',
      script: './services/matches/dist/main.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3005,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3005,
      },
      error_file: './logs/matches-error.log',
      out_file: './logs/matches-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
    },
  ],
};

