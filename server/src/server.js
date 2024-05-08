// Importing modules
import express from "express";
import cors from "cors";
import path from "path";
import { connect } from "./config/connectDB";
import bodyParser from "body-parser";
import session from 'express-session';
import { config } from "dotenv";
let {handleChatGPTtext} = require("./controllers/appController")

// Environment configuration
config();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// Initialize express app
let app = express();

// Middleware setup
app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: true }));
app.use(session({
  secret: "something",
  resave: true,
  saveUninitialized: true
}));


// Static files and view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "../../client/views"));
app.use(express.static(path.join(__dirname, "../../client/static")));

app.post('/test', handleChatGPTtext)

// Routes
require("./route/route")(app)

// Database connection
connect();

// Server setup
let port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log(`Server is running in port ${port}`);
});
