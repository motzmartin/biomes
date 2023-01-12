const c = document.querySelector("canvas");
const ctx = c.getContext("2d");

ctx.imageSmoothingEnabled = false;

const keyboard = {};
const plr = new Player();

const c_img = document.createElement("canvas");
const ctx_img = c_img.getContext("2d", {willReadFrequently: true});

c_img.width = 16;
c_img.height = 16;

function getRandomColor(texture)
{
    ctx_img.clearRect(0, 0, 16, 16);
    ctx_img.drawImage(texture, 0, 0, 16, 16);

    return ctx_img.getImageData(0, 0, 16, 16).data;
}

let heighest_x = 0;
let heighest_y = 0;
for (let i = 0; i < map_height; i++)
{
    for (let j = 0; j < map_width; j++)
    {
        if (map[i][j].height < map[heighest_y][heighest_x].height)
        {
            heighest_x = j;
            heighest_y = i;
        }
    }
}
plr.map_x = heighest_x;
plr.map_y = heighest_y;

document.onkeydown = (e) => keyboard[e.key] = true;
document.onkeyup = (e) => keyboard[e.key] = false;

let cursor_x = 0;
let cursor_y = 0;
document.onmousemove = (e) =>
{
    cursor_x = Math.floor(e.clientX / 3);
    cursor_y = Math.floor(e.clientY / 3);
}

let mouse_down = false;
document.onmousedown = () =>
{
    mouse_down = true;
}
document.onmouseup = () =>
{
    mouse_down = false;
}

let left_click = false;
document.onclick = () =>
{
    left_click = true;
}

let right_click = false;
document.oncontextmenu = () =>
{
    right_click = true;
    return false;
}

document.onwheel = (e) =>
{
    if (e.deltaY < 0 && plr.item_selected > 0)
    {
        plr.item_selected--;
    }
    else if (e.deltaY > 0 && plr.item_selected < 23)
    {
        plr.item_selected++;
    }
}

const framerate = 60;
const interval = 1000 / framerate;
let now;
let delta;
let then = Date.now();

function draw()
{
    requestAnimationFrame(draw);

    now = Date.now();
    delta = now - then;

    if (delta > interval)
    {
        then = now - (delta % interval);

        plr.update(keyboard);

        let pattern;
        switch (map[plr.map_y][plr.map_x].biome_type)
        {
            case 0:
                pattern = ctx.createPattern(grass_background_0, "repeat");
                break;
            case 1:
                pattern = ctx.createPattern(grass_background_1, "repeat");
                break;
            case 2:
                pattern = ctx.createPattern(sand_background, "repeat");
                break;
            case 3:
                pattern = ctx.createPattern(stone_background, "repeat");
        }
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, 192, 192);

        const tiles = map[plr.map_y][plr.map_x].tiles;

        let tile_selected_x = Math.floor(cursor_x / 16);
        if (tile_selected_x < 0)
        {
            tile_selected_x = 0;
        }
        else if (tile_selected_x > 11)
        {
            tile_selected_x = 11;
        }

        let tile_selected_y = Math.floor(cursor_y / 16);
        if (tile_selected_y < 0)
        {
            tile_selected_y = 0;
        }
        else if (tile_selected_y > 11)
        {
            tile_selected_y = 11;
        }

        if (left_click && tiles[tile_selected_y][tile_selected_x] != null)
        {
            let exist = false;
            for (let i = 0; i < plr.inventory.length; i++)
            {
                if (plr.inventory[i].id == tiles[tile_selected_y][tile_selected_x])
                {
                    plr.inventory[i].quantity++;
                    exist = true;
                    break;
                }
            }
            if (!exist)
            {
                plr.inventory.push(
                    {
                        id: tiles[tile_selected_y][tile_selected_x],
                        quantity: 1
                    }
                );
            }
            tiles[tile_selected_y][tile_selected_x] = null;
        }

        if (right_click && tiles[tile_selected_y][tile_selected_x] == null)
        {
            if (plr.item_selected < plr.inventory.length)
            {
                tiles[tile_selected_y][tile_selected_x] = plr.inventory[plr.item_selected].id;
                plr.inventory[plr.item_selected].quantity--;
                if (plr.inventory[plr.item_selected].quantity <= 0)
                {
                    plr.inventory.splice(plr.item_selected, 1);
                }
            }
        }

        for (let i = 0; i < 12; i++)
        {
            for (let j = 0; j < 12; j++)
            {
                const tile = tiles[i][j];
                if (tile != null && (plr.y > i * 16 || !blocks_properties[tile].relief))
                {
                    ctx.drawImage(blocks_properties[tile].texture, j * 16, i * 16);
                    if (tile_selected_x == j && tile_selected_y == i)
                    {
                        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
                        ctx.fillRect(j * 16, i * 16, 16, 16);
                    }
                }
            }
        }

        ctx.drawImage(player, plr.sprite_x * 16, plr.sprite_y * 16, 16, 16, plr.x, plr.y, 16, 16);

        for (let i = 0; i < 12; i++)
        {
            for (let j = 0; j < 12; j++)
            {
                const tile = tiles[i][j];
                if (tile != null && (plr.y <= i * 16 && blocks_properties[tile].relief))
                {
                    ctx.drawImage(blocks_properties[tile].texture, j * 16, i * 16);
                    if (tile_selected_x == j && tile_selected_y == i)
                    {
                        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
                        ctx.fillRect(j * 16, i * 16, 16, 16);
                    }
                }
            }
        }

        if (tiles[tile_selected_y][tile_selected_x] == null && plr.item_selected < plr.inventory.length)
        {
            ctx.globalAlpha = 0.5;
            ctx.drawImage(blocks_properties[plr.inventory[plr.item_selected].id].texture, tile_selected_x * 16, tile_selected_y * 16);
            ctx.globalAlpha = 1;
        }

        ctx.drawImage(map_image, 192, 2);
        ctx.fillStyle = "#F00";
        ctx.fillRect(192 + plr.map_x, 2 + plr.map_y, 1, 1);

        ctx.drawImage(game_ui, 0, 0);

        const hp_bar_width = Math.floor(plr.hp / 50 * 23);
        ctx.drawImage(hp_bar, 0, 0, hp_bar_width, 3, 204, 70, hp_bar_width, 3);

        const hunger_bar_width = Math.floor(plr.hunger / 50 * 23);
        ctx.drawImage(hunger_bar, 0, 0, hunger_bar_width, 3, 204, 78, hunger_bar_width, 3);

        const exp_bar_width = Math.floor(plr.exp / 50 * 23);
        ctx.drawImage(exp_bar, 0, 0, exp_bar_width, 3, 204, 86, exp_bar_width, 3);

        for (let i = 0; i < plr.inventory.length; i++) {
            const x = 192 + (i % 4) * 16;
            const y = 95 + Math.floor(i / 4) * 16;
            ctx.drawImage(blocks_properties[plr.inventory[i].id].texture, x + 1, y + 1, 13, 13);

            if (plr.inventory[i].quantity > 1)
            {
                const quantity_str = String(plr.inventory[i].quantity);
                for (let j = 0; j < quantity_str.length; j++)
                {
                    ctx.drawImage(numbers, Number(quantity_str[j]) * 3, 0, 3, 5, x + j * 4 + 1, y + 9, 3, 5);
                }
            }
        }

        const inventory_selector_x = 192 + (plr.item_selected % 4) * 16;
        const inventory_selector_y = 95 + Math.floor(plr.item_selected / 4) * 16;
        ctx.drawImage(inventory_selector, inventory_selector_x, inventory_selector_y);

        if (tiles[tile_selected_y][tile_selected_x] != null)
        {
            ctx.drawImage(crosshair_1, cursor_x - 1, cursor_y - 1);
        }
        else
        {
            ctx.drawImage(crosshair_0, cursor_x, cursor_y);
        }

        if (map[plr.map_y][plr.map_x].biome_type == 3)
        {
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(0, 0, 256, 192);
        }

        if (left_click)
        {
            left_click = false;
        }
        if (right_click)
        {
            right_click = false;
        }
    }
}

draw();