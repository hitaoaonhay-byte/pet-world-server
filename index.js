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
pool.query(`
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE,
    coin INTEGER DEFAULT 0,
    gem INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    food INTEGER DEFAULT 100,
    pettype TEXT DEFAULT 'none'
);
`);
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Pet World API đang hoạt động!");
});
app.post("/save", async (req, res) => {

    const {
        name,
        coin,
        gem,
        level,
        xp,
        food,
        pettype
    } = req.body;

    try {

        await pool.query(`
        INSERT INTO players
        (name, coin, gem, level, xp, food, pettype)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        ON CONFLICT (name)
        DO UPDATE SET
        coin=$2,
        gem=$3,
        level=$4,
        xp=$5,
        food=$6,
        pettype=$7
        `, [
            name,
            coin,
            gem,
            level,
            xp,
            food,
            pettype
        ]);

        res.json({
            success: true
        });

    } catch (err) {

        console.log(err);

        res.json({
            success: false
        });

    }

});
pool.query("SELECT NOW()")
.then(() => {
    console.log("Đã kết nối PostgreSQL");
})
.catch(err => {
    console.error("Lỗi PostgreSQL:", err);
});
app.get("/load/:name", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT * FROM players WHERE name=$1",
            [req.params.name]
        );

        if (result.rows.length === 0) {
            return res.json({
                success: false
            });
        }

        res.json({
            success: true,
            player: result.rows[0]
        });

    } catch (err) {

        console.log(err);

        res.json({
            success: false
        });

    }

});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server chạy cổng " + PORT);
});
