const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-store";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },
  {
    resolve: "medusa-plugin-strapi-ts",
    options: {
      encryption_algorithm: "aes-256-cbc",
      strapi_protocol: process?.env?.STRAPI_PROTOCOL,
      strapi_default_user: {
        username: process?.env?.STRAPI_MEDUSA_USER,
        password: process?.env?.STRAPI_MEDUSA_PASSWORD,
        email: process?.env?.STRAPI_MEDUSA_EMAIL,
        confirmed: true,
        blocked: false,
        provider: "local",
      },
      strapi_host: process?.env?.STRAPI_SERVER_HOSTNAME,
      strapi_admin: {
        username: process?.env?.STRAPI_SUPER_USERNAME || "SuperUser",
        password: process?.env?.STRAPI_SUPER_PASSWORD || "MedusaStrapi1",
        email:
          process?.env?.STRAPI_SUPER_USER_EMAIL ||
          "support@medusa-commerce.com",
      },
      strapi_port: process?.env?.STRAPI_PORT,
      strapi_secret: process?.env?.STRAPI_SECRET,
      strapi_public_key: process?.env?.STRAPI_PUBLIC_KEY,
      strapi_ignore_threshold: 3,
      auto_start: true,
    },
  },
];

const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL,
    },
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL,
    },
  },
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwt_secret: process.env.JWT_SECRET,
  cookie_secret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  // Uncomment the following lines to enable REDIS
  redis_url: REDIS_URL,
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};
