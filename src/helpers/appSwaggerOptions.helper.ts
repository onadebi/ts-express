import swaggerJsDoc from "swagger-jsdoc";
import { Express, Request, Response } from "express";
import swaggerUI from "swagger-ui-express";

const AppSwaggerOptions: swaggerJsDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "App Global",
      version: "0.0.1",
      description: "App Description",
      contact: {
        name: "Onaxsys Ventures",
        email: "info@onaxsys.com",
        url: "https://onaxsys.com",
      },
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/modules/*/*.model.ts",
    "./src/modules/*/*.controller.ts",
  ],
};

const swaggerSpec = swaggerJsDoc(AppSwaggerOptions);

function swaggerDocs(app: Express, port: number) {
  // Swagger page
  app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

  // Docs in JSON format
  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;