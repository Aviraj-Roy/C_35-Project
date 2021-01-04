var dog, happyDog, dogImg, happyDogImg;
var foodS, foodStock; var feedPet, addFood, fedTime, foodObj, backPos;
var bottle = 20; var lastFed=0; var suffix="";
var database; 

function preload()
{
  dogImg = loadImage("Dog.png");
  happyDogImg = loadImage("happydog.png");
}

function setup() 
{
  createCanvas(500, 500);
  
  database = firebase.database();

  dog = createSprite(400, 400, 10, 10);
  dog.scale = 0.2;
  dog.addImage(dogImg);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);  

  feed= createButton("Feed the Dog");
  feed.position(585,65);
  feed.mousePressed(feedDog);

  addFood= createButton("Add food");
  addFood.position(700,65);
  addFood.mousePressed(addFoods);

  backPos= createButton("Attention");
  backPos.position(500,65);
  backPos.mousePressed(backToPosition);
}


function draw() 
{  
  background(46, 139, 87);

  drawSprites();
  
  fedTime=database.ref("FeedTime");
  fedTime.on("value",function(data){
  lastFed=data.val();
  })

  if(lastFed > 00 && lastFed < 12)
  {
    suffix ="AM";
  }
  if(lastFed > 12 && lastFed < 0)
  {
    suffix = "PM";
  }  
  textSize(20); fill("white"); stroke("red"); strokeWeight(20);  
  text("Last Fed: "+ lastFed + suffix , 80, 105 );
  
  function readStock(data)
  { 
    foodS=data.val();
  }
  
  foodObj.display();
  
  function writeStock(x)
  {
    if(x<=0)
    {
      x=0;
    }
    else
    {
      x=x-1;
    }
    
    database.ref("/").update({
      Food:x
    })
  }
}

function feedDog()
  {
    dog.x=200;
    dog.addImage(happyDogImg);
    
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref("/").update({
      Food : foodObj.getFoodStock(),
      FeedTime :  hour()
    });
    
  }
  
function addFoods()
  {
    foodS++;
    database.ref("/").update({
      Food:foodS
    })
  }

function readStock(data)
  {
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
  }

function backToPosition()
{
  dog.x = 400;
  dog.addImage(dogImg)
}