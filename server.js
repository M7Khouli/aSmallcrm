const dotEnv = require("dotenv");

dotEnv.config({ path: "./.env" });

process.on("uncaughtException", (err) => {
  console.log("Unhandled Exception!!!💥💥 shutting down....");
  console.log(err);
  console.log(err.name, err.message);

  process.exit(1);
});
const app = require("./app");

const server = app.listen(process.env.PORT, "0.0.0.0");

process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection!!!💥💥 shutting down....");
  console.log(err.name);
  server.close(() => {
    process.exit(1);
  });
});
