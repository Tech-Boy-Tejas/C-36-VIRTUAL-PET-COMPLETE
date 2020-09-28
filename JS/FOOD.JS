class Food{
    constructor(){
        this.image = loadImage('virtual pet images/milk.png');
    }

    async getFoodStock(){
        var foodRef = await database.ref('foodStock').once("value");
        foodRef.on("value",function(data){
            foodStock = data.val();
        });
    }

    updateFoodStock(state){
        database.ref('/').update({
            'foodStock':state
        });
    }

    display(){
        var x = 20, y = 300;

        if(foodStock !== 0){
            for(var j = 0; j < foodStock; j++){
                if(j % 10 === 0){
                    x = 20;
                    y += 50;
                }
                image(this.image,x,y,50,50);
                x += 30;
            }
        }
    }

    bedroom(){
        background(bedroomImg,250,250);
    }

    garden(){
        background(gardenImg,550,500);
    }

    washroom(){
        background(washroomImg,550,500);
    }

}