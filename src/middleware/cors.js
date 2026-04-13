const cors = require("cors");

const corsOptions = {
  origin: [
    "http://localhost:4000",
    "https://newbiejy235.github.io",
    "https://login-register02-production-85a9.up.railway.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

module.exports = cors(corsOptions);
