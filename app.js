const express = require('express');
const cors = require('cors');  
const dotenv = require("dotenv");
const dbConnection = require("./config/dbConnection");
const gameRoutes = require("./routes/gameRoutes");
const playerRoutes = require("./routes/playerRoutes");
const questionRoutes = require("./routes/questionRoutes");

dotenv.config();
dbConnection();

const app = express();
app.use(express.json()); 
app.use(cors()); 

app.use('/api/games', gameRoutes);
// app.use("/api/players", playerRoutes);
app.use("/api/questions",questionRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});