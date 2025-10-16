require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`🚀 API listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error("DB connection failed:", err.message);
    // process.exit(1);
  }
  app.listen(PORT, () =>
    console.log(`🚀 API listening on http://localhost:${PORT}`)
  );
})();
