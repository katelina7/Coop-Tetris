var gameScreen = document.getElementById("myCanvas");
var ctx = gameScreen.getContext("2d");

//0 = available, 1 = filled
//10 x 21 grid, top row is to check game over
var gameMapXY = [];  
var offsetY = 0;
var height = 800;
var offsetX = 440;
var width = 400;
var blockSize = 40;


var padding = {x:0, y:0};
var blocks = new Array({x:0,y:0}, {x:0,y:0}, {x:0,y:0}, {x:0,y:0}, "block type", "#86E2FF");
var ranBlocks = [blockO, blockS, blockZ, blockI, blockJ, blockL, blockT];
var ranNum = 0;

document.addEventListener("keydown", keyDown);
init();
gameStart();
var game = setInterval(update, 800);

function init(){
    
    ctx.beginPath();
    ctx.rect(340, 0, 600, 800);
    ctx.fillStyle = "#3E3E3E";
    ctx.fill();
    ctx.closePath();

    setUpGrid();

    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    ctx.lineTo(offsetX, offsetY + height);
    ctx.stroke();
    ctx.moveTo(offsetX + width, offsetY);
    ctx.lineTo(offsetX + width, offsetY + height);
    ctx.stroke();

    for (x = 0; x < 10; x++){
        gameMapXY.push(new Array(21));
    }
}

function setUpGrid(){
    for (y = 0; y < 20; y++){
        for (i = 0; i < 10; i++){
            ctx.beginPath();
            ctx.rect(offsetX + 1 + i * blockSize, offsetY + 1 + y * blockSize, 38, 38);
            ctx.strokeStyle = "#5C5C5C";
            ctx.stroke();
            ctx.closePath();
        }
    }
    
}
function clearRow(rowY){
    for (i = 0; i < 10; i++){
        ctx.beginPath();
        ctx.rect(offsetX + 1 + i * blockSize, offsetY + 1 + rowY * blockSize, 36, 36);
        ctx.fillStyle = "#3E3E3E";
        ctx.fill();
        ctx.closePath();
    }
}

function clearBlock(colX, rowY){
    if (rowY >= 0 && rowY < 20){
        ctx.beginPath();
        ctx.rect(offsetX + 1 + colX * blockSize, offsetY + 1 + rowY * blockSize, 36, 36);
        ctx.fillStyle = "#3E3E3E";
        ctx.fill();
        ctx.closePath();
    }
    
}

function clearBlocks(){
    for (i = 0; i < 4; i++){
            clearBlock(blocks[i].x, blocks[i].y);
    }
}

function gameStart(){
    for (x = 0; x < 10; x++){
        for (y = 0; y < 21; y++){
            gameMapXY[x][y] = 0;
        }
    }

    for (y = 0; y < 20; y++){
        clearRow(y);
    }
    setBlocks();
    drawBlocks();
}

function setBlocks(){
    var ran = Math.floor(Math.random() * ranBlocks.length);
    ranBlocks[ran]();
}

function validBlock(x, y){
    
    if (!validX(x)){
        return false;
    }
    if (!validY(y)){
        return false;
    }
    if (gameMapXY[x][y + 1] == 1){
        return false;
    }
    
    return true;
}

function validX(x){
    return (x >= 0 && x < 10);
}

function validY(y){
    return (y >= -1 && y < 20);
}

function validDrawY(y){
    return (y >= 0 && y < 20);
}
function keyDown(e){
    
    var dx = 0;
    var dy = 0;
    
    clearBlocks();

    if (e.key == "ArrowRight"){
        dx = 1;
    } else if (e.key == "ArrowLeft"){
        dx = -1;
    } else if (e.key == "ArrowUp"){
        rotate();
    } else if (e.key == "ArrowDown"){
        dy = 1;
    }

    moveBlocks(dx, dy);
    drawBlocks();
    
    dx = 0;
    dy = 0;
}

function rotate(){
    if (blocks[4] != "blockI"){
        for (i = 1; i < 4; i++){
            blocks[i].x -= blocks[0].x;
            blocks[i].y -= blocks[0].y;
            temp = blocks[i].x;
            blocks[i].x = blocks[i].y;
            blocks[i].y = temp;
            blocks[i].x = blocks[i].x * -1;
            blocks[i].x += blocks[0].x;
            blocks[i].y += blocks[0].y;
            blocks[i].x += padding.x;
            blocks[i].y += padding.y;
            if (blocks[i].x < 0){
                moveBlocks(1, 0);
            } else if (blocks[i].x > 10){
                moveBlocks(-1, 0);
            } else if (blocks[i].y )
        }

    }else{
        
    }
}

function moveBlocks(dx, dy){
    for (i = 0; i < 4; i++){
        var newX = blocks[i].x + dx;
        var newY = blocks[i].y + dy;
        
        if (!validBlock(newX, newY)){
            return false;
        }
    }
    for (i = 0; i < 4; i++){
        blocks[i].x += dx;
        blocks[i].y += dy;
    }
    return true;
}

function drawBlocks(){
    for (i = 0; i < 4; i++){
        if (validX(blocks[i].x) && validDrawY(blocks[i].y)){
            ctx.beginPath();
            // ctx.rect(offsetX + blockSize * blocks[i].x, offsetY + blockSize * blocks[i].y, 40, 40);
            ctx.rect(offsetX + blockSize * blocks[i].x + 1, offsetY + blockSize * blocks[i].y + 1, 36, 36);
            ctx.fillStyle = blocks[5];
            ctx.fill();
            ctx.closePath();
        }
    }
}

function update(){
    
    clearBlocks();
    
    
    if (moveBlocks(0, 1)){
        drawBlocks();            
    } else{

        //update game map
        for (i = 0; i < 4; i++){
            gameMapXY[blocks[i].x][blocks[i].y + 1] = 1;
        }

        //check if game over
        for (x = 0; x < 10; x++){
            if (gameMapXY[x][0] == 1){
                clearInterval(game);
                alert("game over");
                break;
            }
        }
        drawBlocks();            

        //if second row is filled, move new block up one row.
        setBlocks();

        for (i = 0; i < 4; i++){
            if (!validBlock(blocks[i].x,blocks[i].y)){
                moveBlocks(0, -1);
                break;
            }
        }
        
        drawBlocks();            
    }

    
}

function blockO(){
    blocks[0].x = 4; blocks[0].y = 0;
    blocks[1].x = 5; blocks[1].y = 0;
    blocks[2].x = 4; blocks[2].y = 1;
    blocks[3].x = 5; blocks[3].y = 1;
    blocks[4] = "blockO";
    blocks[5] = "#FCFF65";
    padding.x = 1; padding.y = 0;
}

function blockS(){
    blocks[0].x = 4; blocks[0].y = 1;
    blocks[1].x = 5; blocks[1].y = 0;
    blocks[2].x = 4; blocks[2].y = 0;
    blocks[3].x = 3; blocks[3].y = 1;
    blocks[4] = "blockS";
    blocks[5] = "#69FD66";
    padding.x = 0; padding.y = 0;
}

function blockZ(){
    blocks[0].x = 4; blocks[0].y = 1;
    blocks[1].x = 3; blocks[1].y = 0;
    blocks[2].x = 4; blocks[2].y = 0;
    blocks[3].x = 5; blocks[3].y = 1;
    blocks[4] = "blockZ";
    blocks[5] = "#FF8EB7";
    padding.x = 0; padding.y = 0;
}

function blockJ(){
    blocks[0].x = 4; blocks[0].y = 1;
    blocks[1].x = 3; blocks[1].y = 1;
    blocks[2].x = 3; blocks[2].y = 0;
    blocks[3].x = 5; blocks[3].y = 1;
    blocks[4] = "blockJ";
    blocks[5] = "#3C8AFF";
    padding.x = 0; padding.y = 0;
}

function blockL(){
    blocks[0].x = 4; blocks[0].y = 1;
    blocks[1].x = 3; blocks[1].y = 1;
    blocks[2].x = 5; blocks[2].y = 1;
    blocks[3].x = 3; blocks[3].y = 0;
    blocks[4] = "blockL";
    blocks[5] = "#FF7A00";
    padding.x = 0; padding.y = 0;
}

function blockI(){
    blocks[0].x = 3; blocks[0].y = 1;
    blocks[1].x = 4; blocks[1].y = 1;
    blocks[2].x = 5; blocks[2].y = 1;
    blocks[3].x = 6; blocks[3].y = 1;
    blocks[4] = "blockI";
    blocks[5] = "#88E2FF";
    padding.x = 0; padding.y = 0;
}

function blockT(){
    blocks[0].x = 4; blocks[0].y = 1;
    blocks[1].x = 4; blocks[1].y = 0;
    blocks[2].x = 3; blocks[2].y = 1;
    blocks[3].x = 5; blocks[3].y = 1;
    blocks[4] = "blockT";
    blocks[5] = "#B251FF";
    padding.x = 0; padding.y = 0;
}