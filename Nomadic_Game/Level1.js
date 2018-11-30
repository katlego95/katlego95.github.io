EnemyBird = function (index,game,x,y){
// bird enemy
this.bird = game.add.sprite(x,y,'bird');
this.bird.anchor.setTo(0.5,0.5);
this.bird.name= index.toString();

game.physics.enable(this.bird,Phaser.Physics.ARCADE);
this.bird.body.immovable = true ;
this.bird.body.collideWorldBounds = true;
this.bird.body.allowGravity = false ;

this.birdTween = game.add.tween(this.bird).to({
  y: this.bird.y + 25
},2000,'Linear',true,0,100,true);// bird moves up and down

}


var enemy1;




Game.Level1 = function(game){};

var map;
var layer;

var player;
var shootTime = 0 ;
var nuts;
var controls= {};
var playerSpeed = 200;
var jumpTimer= 0;
var drag;
var stars;
var bombs;


Game.Level1.prototype = {
  create: function (game) {
    this.stage.backgroundColor = '#3A5963';

    this.physics.arcade.gravity.y = 1400;

    map = this.add.tilemap('map',64,64);

    map.addTilesetImage('tileset');

    layer = map.createLayer(0);
    layer.resizeWorld();

    map.setCollisionBetween(0,2);

    map.setTileIndexCallback(5,this.resetPlayer,this); //obsticle tile
    map.setTileIndexCallback(6,this.getCoin,this); // coin tile

    player = this.add.sprite(100,560,'player');
    player.anchor.setTo(0.5,0.5);

    player.animations.add('idle',[0,1],1,true); // animation frames
    player.animations.add('jump',[2],1,true);
    player.animations.add('run',[3,4,5,6,7,8],7,true);
    this.physics.arcade.enable(player);
    this.camera.follow(player);
    player.body.collideWorldBounds = true;

    controls = {
right: this.input.keyboard.addKey(Phaser.Keyboard.D),
left: this.input.keyboard.addKey(Phaser.Keyboard.A),  //game control keys "D" , "A" , "W" & UP arrow key
up: this.input.keyboard.addKey(Phaser.Keyboard.W),
shoot: this.input.keyboard.addKey(Phaser.Keyboard.UP)

};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////






//////////////////////////////////////////////////////////////////////////////////////////



drag = this.add.sprite(player.x, player.y, 'drag'); // draggable fruit object
drag.anchor.setTo(0.5,0.5);
drag.inputEnabled= true;
drag.input.enableDrag(true);

 enemy1 = new EnemyBird(0,game,player.x+400,player.y-200); // create new enemy

 nuts = game.add.group(); // create nut bullets
 nuts.enableBody = true;
 nuts.physicsBodyType = Phaser.Physics.ARCADE;
 nuts.createMultiple(5,'nut');

 nuts.setAll('anchor.x',0.5);
 nuts.setAll('anchor.y',0.5);
 nuts.setAll('scale.x',0.5);
 nuts.setAll('scale.y',0.5);
 nuts.setAll('outOfBoundsKill',true);
 nuts.setAll('checkWolrdBounds',true);
  },

  update: function (){
this.physics.arcade.collide(player,layer);
this.physics.arcade.collide(player,enemy1.bird,this.resetPlayer); // destroy body of enemy

player.body.velocity.x = 0;

//if(controls.up.isDown){player.animations.play('jump');}


if(controls.right.isDown){
  player.animations.play('run');
  player.scale.setTo(1,1); // right animation
  player.body.velocity.x += playerSpeed;
}

if(controls.left.isDown){
  player.animations.play('run');
  player.scale.setTo(-1,1);
  player.body.velocity.x -= playerSpeed; // left animation
}

if(controls.up.isDown && (player.body.onFloor() || player.body.touching.down) && this.time.now > jumpTimer  )
{

  player.body.velocity.y = -600;
  jumpTimer = this.time.now +750; //jump animation
  player.animations.play('jump');

}

if (player.body.velocity.x == 0 && player.body.velocity.y == 0){
  player.animations.play('idle'); // freeze frame when player isnt moving
}


if (controls.shoot.isDown){
this.shootNut(); //if up arrow key is pressed , shoot function
}


if(checkOverlap(nuts,enemy1.bird)){
  enemy1.bird.kill(); // if bullet and bird collide kill bird
}

},

  resetPlayer: function (){
    player.reset(100,560); // respawn function
  },

  getCoin: function (){
  map.putTile(-1,layer.getTileX(player.x), layer.getTileY(player.y)); //once player collides with coin it disappears and is replaced by empty tile
  },

  shootNut: function (){
    if (this.time.now > shootTime){
      nut = nuts.getFirstExists(false);
      if (nut){
        nut.reset(player.x,player.y);
        nut.body.velocity.y = -600; // nut shoots up

        shootTime = this.time.now + 900;
      }
    }
  }

}



function checkOverlap (spriteA,spriteB){
// check if player and enemy over lap
  var boundsA = spriteA.getBounds();
  var boundsB = spriteB.getBounds();

return Phaser.Rectangle.intersects(boundsA,boundsB);


}
