const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const img= ["https://assets.cntraveller.in/photos/62f221ad30bfdf56888504b0/master/w_4633,h_3088,c_limit/1215861035","https://m.economictimes.com/thumb/msid-94552429,width-1200,height-900,resizemode-4,imgsize-27870/air-india-plane.jpg"
             ,"https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2022/02/01135456/Untitled-design.jpg?tr=w-1200,h-900", "https://www.livemint.com/lm-img/img/2023/05/15/600x338/GO-FIRST-AIRWAYS_1684119787105_1684119787490.JPG" ]

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.render("home.ejs");
})

app.get("/flights/:flightNo",function(req,res){

    var num =  req.params.flightNo.split("flight",2)[1];
    res.render("flight.ejs",{
        flightNo:num,
        image: img[1+num],
        faults: ""
    });
})

app.get("/conditions/:condition",function(req,res){
    res.render("condition.ejs",{
        condition:req.params.condition
    })
})

app.post("/flights/:flightNo",function(req,res){

    var num =  req.params.flightNo.split("flight",2)[1];

    var indicators = {
        fuel : req.body.fuel,
        altitude : req.body.altitude,
        flaps : req.body.flaps,
        ngear : req.body.nosegear
        };
    
    var faults = ""
    var goodtofly = 1
    //if the fuel is lesser than 5000 litres then the plane has fuel 
    //10000 metres is the lowest a plane can fly , so it shows the fault if the plane is flying very low 
    //If the flaps open is less than 6 then there is fault in the flaps 
    //If the nosegear is down when the plane is flying then there is fault , since the nosegear needs to be retracted while it is flying 

        if(indicators.fuel<=5000)
        {
            faults = faults+"Fuel is low ";
            goodtofly = 0;
        }
        if(indicators.altitude<=10000)
        {
            if(goodtofly==0)
                faults = faults+"and "
            faults = faults+"The aircraft is flying very low ";
            goodtofly = 0;
        }
        if(indicators.flaps<6)
        {
            if(goodtofly==0)
                faults = faults+"and "
            faults = faults+"Flaps are not proper \n";
            goodtofly = 0;
        }
        if(indicators.ngear==="on")
        {
            if(goodtofly==0)
                faults = faults+"and "
            faults = faults+"Nose gear is down. ";
            goodtofly = 0;
        }
        if(goodtofly===0)
            faults = faults+" Flight is the not good to fly!!!!  "
        else    
            faults = faults + "Flight is good to fly!!" 

    res.render("flight.ejs",{
        flightNo:num,
        faults : faults
    });
})

app.listen(3000,function(){
    console.log("The session started");
}) 