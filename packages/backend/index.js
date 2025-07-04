const express = require("express");
const logger = require("morgan");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const http = require("http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const path = require("path");

// Server creation
const server = http.createServer(app);

const port = 9091;

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "StackUp API Documentation",
      version: "1.0.0",
      description: "Documentation of the Stackup API",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Dev server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to files containing the roads
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Database connection
mongoose
  .connect("mongodb+srv://admin:admin@stackup.bikox.mongodb.net/test", {})
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Error in connecting to the database", err);
  });

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.set("trust proxy", true);

app.use(logger("dev"));

// Extend the limit of the body
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));

app.use("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/user/", require("./routes/userRoute"));
app.use("/api/warehouse/", require("./routes/warehouseRoute"));
app.use("/api/bloc/", require("./routes/blocRoute"));
app.use("/api/note/", require("./routes/noteRoute"));
app.use("/api/tag/", require("./routes/tagRoute"));

server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
