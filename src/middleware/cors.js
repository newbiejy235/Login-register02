const cors = require("cors");

const corsOptions = {
  origin: [
    "http://localhost:4000",
    "https://newbiejy235.github.io/LogiinPrev",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

module.exports = cors(corsOptions);
