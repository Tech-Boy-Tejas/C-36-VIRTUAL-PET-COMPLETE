//Create variables here
var dog,happyDog;
var database;

var foodStock;

var feedDogButton,addFoodButton;
var fedTime,lastFed;
var currenttime;

var gameState,readState,changeState;

var bedroomImg,gardenImg,WashroomImg;

var sadDogImg;

function preload()
{
  dogImg = loadImage("virtual pet images/Dog.png");

  bedroomImg = loadImage("virtual pet images/Bed Room.png");
  gardenImg = loadImage("virtual pet images/Garden.png");
  WashroomImg = loadImage("virtual pet images/Wash Room.png");
 
  sadDogImg = loadImage("virtual pet images/Lazy.png");
  happydogImg = loadImage("virtual pet images/Happy.png");
}

function setup() {
  database = firebase.database();
  createCanvas(500, 500);
  
  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  })
  
  var foodStocks = database.ref('foodStock')
  foodStocks.on("value",function(data){
    foodStock = data.val();
  });

  foodObj = new Food();
  
}


function draw() {  
  background(46, 139, 87);
  fill("red");

  feedDogButton = createButton('FEED THE DOG');
  addFoodButton = createButton('ADD FOOD');

  currenttime = hour();

  
  console.log(gameState);
  feedDogButton.position(450,50);
  addFoodButton.position(650,50);

  feedDogButton.mousePressed(function(){
  
  foodStock--;
  database.ref('/').update({
    'foodStock':foodStock,
    'feedTime':hour()
  });
  
  if(dog.x > 200 && dog.y < 300){
    dog.x -= 50;
    dog.y += 50;
  }
  
  if(foodStock === 0){
    foodStock = 0;
  }
  
  });

  //feedDogButton.hide();
  //addFoodButton.hide();

  addFoodButton.mousePressed(function(){
    foodStock++;
    database.ref('/').update({
      'foodStock':foodStock
    })
  });

  if(gameState != "hungry"){
    feedDogButton.hide();
    addFoodButton.hide();

  }
  if(gameState === "hungry"){
    feedDogButton.show();
    addFoodButton.show();
    image(sadDogImg,180,180,220,220);
  }

  console.log(foodStock);

  fedTime = database.ref('feedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })

  fill(255,255,254);
  textSize(15);
  if(lastFed !== undefined){
    if(lastFed >= 12){
      text("Last Fed: " + lastFed % 12 + "PM",200,50);
    }
    else if(lastFed === 0){
      text("Last Fed: 12 AM",200,50);
    }
    else{
      text("Last Fed: " + lastFed + "AM",200,50);
    }  
  }

  if(currenttime === lastFed + 1){
    foodObj.garden();
    updateState("playing");
  }
  else if(currenttime === lastFed + 2){
    foodObj.bedroom();
    updateState("sleeping");
  }
  else if(currenttime > lastFed + 2 && currenttime < lastFed + 4){
    foodObj.washroom();
    updateState("bathing");
  }
  else{
    updateState("hungry");
    foodObj.display();
  }

    console.log(lastFed)
    drawSprites();
  
}

function writeStock(x){

  if(x <= 0){
    x = 0;
  }
  else{
    x = x - 1;
  }
  database.ref('/').update({
    foodStock:x
  })
}

function updateState(state){
  database.ref('/').update({
    'gameState':state
  });
}



