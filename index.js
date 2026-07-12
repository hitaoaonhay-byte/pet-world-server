const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Pet World API đang hoạt động!");
});
pool.query("SELECT NOW()")
.then(() => {
    console.log("Đã kết nối PostgreSQL");
})
.catch(err => {
    console.error("Lỗi PostgreSQL:", err);
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server chạy cổng " + PORT);
});
