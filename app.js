//jshint esversion:6

const express = require("express");

const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const http = require("http").Server(app);
const io = require('socket.io')(http);
const _ = require("lodash");



const errorController = require('./controllers/error');


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque.";


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];
let userData = {
  username :"",
  mail : "",
  password : ""
}



app.get('/community', function(req, res) {
  res.render('index.ejs');
});

io.sockets.on('connection', function(socket) {
  socket.on('username', function(username) {
      socket.username = username;
      io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
  });

  socket.on('disconnect', function(username) {
      io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
  })

  socket.on('chat_message', function(message) {
      io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
  });

});


app.get("/", function(req, res){
  
  res.render("home", {
    startingContent: homeStartingContent
 
    });
});



app.get("/home", function(req, res){
  
  res.render("home", {
    startingContent: homeStartingContent
 
    });
});



app.get("/learn", function(req, res){
  res.render("learn", {aboutContent: aboutContent,   posts: posts});
});

app.get("/invest", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.get("/community", function(req, res){
  res.render("community", {contactContent: contactContent});
});


app.get("/management", function(req, res){
  res.render("management", {contactContent: contactContent});
});

app.get("/portfolio", function(req, res){
  res.render("portfolio", {contactContent: contactContent});
});


app.get("/about", function(req, res){
  res.render("about", {contactContent: contactContent});
});

app.get("/news", function(req, res){
  res.render("news", { startingContent: homeStartingContent
  });
});


app.get("/faqs", function(req, res){
  res.render("faqs", { startingContent: homeStartingContent
  });
});


// var companyName;

// app.post('/', function(req,res){
//   companyName = req.body.stockSymbole;
//   var comp = companyName.toUpperCase();
  
// var unirest = require("unirest");

// var req = unirest("GET", "https://twelve-data1.p.rapidapi.com/time_series");

// req.query({
// 	"symbol": comp,
// 	"interval": "1day",
// 	"outputsize": "30",
// 	"format": "json"
// });

// req.headers({
// 	"x-rapidapi-key": "bf3b9a57a3mshbdea26c66731707p1f06e6jsn896079d85db7",
// 	"x-rapidapi-host": "twelve-data1.p.rapidapi.com",
// 	"useQueryString": true
// });

// var com;
// req.end(function (res) {
// 	if (res.error) throw new Error(res.error);

//   com = res.body.values[1]
//   console.log(com);
// });


// });



app.get("/admin", function(req, res){
  if(registered){
  res.render("compose");
}
});

app.post("/admin", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  posts.push(post);

  res.redirect("/learn");

});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

});



app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){


        userData.username=req.body.username;
        userData.mail=req.body.email;
        userData.password=req.body.password;
        registered=true;
        res.redirect("/home");
      
  

});


app.post("/login", function(req, res){


    var emailLOgin = req.body.username;
    var userLOgin = req.body.password;
  
 
    if (userData.mail.includes(emailLOgin) && userData.password.includes(userLOgin)) {
      
      res.redirect("/secrets");
    } else {
    
      console.log("error");
      
    }


});




app.use(errorController.get404);


// module.exports?= {userName : userData.username };




const server = http.listen(8080, function() {
  console.log('listening on *:8080');
});