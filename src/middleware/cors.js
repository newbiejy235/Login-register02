const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:4000", "http://127.0.0.1:5500"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

module.exports = cors(corsOptions);
