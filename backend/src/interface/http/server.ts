import express, { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { userRoutes } from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorHandler";

export function makeServer(): Express {
  const app = express();

  app.use(express.json());

  const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "IFReads - Your goodread for IFs",
        version: "1.0.0",
        description: "API for interactive fiction reviews",
      },
      components: {
        schemas: {
          User: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              email: { type: "string" },
              password: { type: "string" },
            },
          },
          InteractiveFiction: {
            type: "object",
            properties: {
              id: { type: "integer" },
              title: { type: "string" },
              description: { type: "string" },
              genre: { type: "string" },
              link: { type: "string" },
              publishedAt: { type: "integer" },
              authorId: { type: "integer" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    apis: ["./src/interface/http/controllers/*.ts"],
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(userRoutes);
  app.use(errorHandler);

  return app;
}
