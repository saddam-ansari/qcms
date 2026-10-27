const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const app = express();

app.use(express.json());
app.use(cors());


// Import routes
const authRoutes = require("./routes/authRoutes");
const inspectionRoutes = require("./routes/inspectionRoutes");
const defectRoutes = require("./routes/defectRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");


// Use routes
app.use("/api/auth",authRoutes);
app.use("/api/inspections",inspectionRoutes);
app.use("/api/defects",defectRoutes);
app.use("/api/dashboard",dashboardRoutes);

app.get("/",(req,res)=>{
    res.send(
        "Quality Control Management System Backend Running"
    );
});

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log(
        `Server running on port ${PORT}`
    );
});