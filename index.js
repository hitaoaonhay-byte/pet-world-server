const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Pet World API đang hoạt động!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server chạy cổng " + PORT);
});
