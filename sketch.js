var dog, happyDog, sadDog,database;
var foods, foodStock;
var fedTime, lastFed;
var feed, addFood;
var foodObj, currentTime;
var gameState, readState;
var bedroomImage, gardenImage, washroomImage;

function preload()
{
  sadDog=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/Happy.png");
  bedroomImage=loadImage("Images/Bed Room.png");
  gardenImage=loadImage("Images/Garden.png");
  washroomImage=loadImage("Images/Wash Room.png");
}

function setup() {
  createCanvas(400,500);
  database=firebase.database();

  foodObj=new Food();

  foodStock=database.ref('food');
  foodStock.on("value",readStock);

  fedTime=database.ref('fedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })

  readState=database.ref('gameState');
  readState.on("value", function(data){
    gameState=data.val();
  });

  dog=createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed The Dog");
  feed.position(450,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(600,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
currentTime=hour();
if(currentTime==(lastFed+1)){
  update("Playing");
  foodObj.garden();
}
else if(currentTime==(lastFed+2)){
   update("Sleeping");
   foodObj.bedroom();
}
else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("Bathing");
  foodObj.washroom();
}else{
  update("Hungry");
  foodObj.display();
}

if(gameState==="Hungry"){
  feed.show();
  addFood.show();
  dog.addImage(sadDog);
  
}else{
  feed.hide();
  addFood.hide();
  dog.remove();
}

  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodstock()-1);
  database.ref('/').update({
    food:foodObj.getFoodstock(),
    fedTime:hour(),
    gameState:"Hungry"
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}