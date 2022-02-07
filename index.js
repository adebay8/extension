const express  = require("express");
const cors = require("cors");

const app = express();

app.use(express.json())
app.use(cors());
app.use(express.urlencoded({extended:false}));

app.post("/create-selling-group", (req, res)=>{
    res.status(200).json({
        message:"request successful"
    })
})

app.listen(9091, () => {
    console.log("server running");
})