import express from 'express'
import dotenv from 'dotenv'

dotenv.config();
const app = express();

app.use(express.json())

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})