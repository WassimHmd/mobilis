import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import basicAuth from "express-basic-auth";
import dotenv from "dotenv";
dotenv.config();

//  definition ::
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Mobilis API",
    version: "1.0.0",
    description: "API for follow me project",
  },
  servers: [
    {
      url: "http://localhost:5000/api/v1",
      description: "API Server",
    },
  ],
  components: {
    securitySchemes: {
      basicAuth: {
        type: "http",
        scheme: "basic",
      },
    },
  },
  security: [
    {
      basicAuth: [],
    },
  ],
};

//  options ::
const options = {
  swaggerDefinition,
  apis: ["./src/router/**/*.ts", "./src/router/**/**/*.ts"],
};

// init ::
const swaggerSpec = swaggerJsdoc(options);

export default function setupSwagger(app: Express) {
  app.use(
    "/api-docs",
    basicAuth({
      users: {
        [process.env.SWAGGER_USERNAME || "default_username"]: process.env.SWAGGER_PASSWORD || "default_password",
      },
      challenge: true,
      unauthorizedResponse: "Unauthorized",
    }),
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
}
