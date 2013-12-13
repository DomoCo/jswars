var renderers = {
    "CAMERA_CONTROL": drawWorld,
    "UNIT_CONTROL": drawWorld,
}

function clearBack() {
    gfx.ctx.fillStyle = "#FFFFFF";
    gfx.ctx.fillRect(0, 0, gfx.width, gfx.height);
}

function drawLine(sx, sy, dx, dy) {
    gfx.ctx.beginPath();
    gfx.ctx.moveTo(sx, sy);
    gfx.ctx.lineTo(dx, dy);
    gfx.ctx.stroke();
}

function drawWorld() {
    drawEnvironment(game.world);

    drawUnits(game.world);

    drawGrid(game.world);
}

function drawEnvironment(world) {
    for (var x = 0; x < world.getWidth(); x++) {
        for (var y = 0; y < world.getHeight(); y++) {
            // Should only be rendering the sprite if it can be seen by the camera
            var current_cell = world.getCell(x, y);
            drawSprite(x, y, current_cell.spriteName)
        }
    }
}

function drawUnits(world) {
    var units = world.getUnits();
    for (var i in units) {
        var position = units[i].pos;
        drawSprite(position['x'], position['y'], units[i].spriteName);
    }
}

function drawSprite(x, y, spriteName) {
    var sprite = assets.sprites.getSprite(spriteName)
    var img = assets.get(sprite.url);
    var pos = sprite.getFramePosition();

    var cam_pos = camera.transformToCameraSpace(x, y);
    // this is incorrect, but is ok for now since all sprites so far will
    // only be 1 cell in size
    var cam_size = camera.multZoomFactor(1, 1);

    gfx.ctx.drawImage(img,
                      pos['x'], pos['y'],
                      sprite.width, sprite.height,
                      cam_pos.cam_x, cam_pos.cam_y,
                      cam_size.cam_w, cam_size.cam_h);
}

function drawGrid(world) {
    gfx.ctx.strokeStyle = "#000000";
    for (var x = 0; x <= world.getWidth(); x++) {
        var draw_x = camera.transformToCameraSpace(x, 0).cam_x;
        var top = camera.transformToCameraSpace(x, 0).cam_y;
        var bot = camera.transformToCameraSpace(x, world.getHeight()).cam_y;
        drawLine(draw_x, top, draw_x, bot);
    }

    for (var y = 0; y <= world.getHeight(); y++) {
        var draw_y = camera.transformToCameraSpace(0, y).cam_y;
        var left = camera.transformToCameraSpace(0, y).cam_x;
        var right = camera.transformToCameraSpace(world.getWidth(), y).cam_x;
        drawLine(left, draw_y, right, draw_y);
    }
}

// should probably render the current state, not necessarily the world
function render() {
    clearBack();

    renderers[game.currentState]()
}
