const map_width = 62;
const map_height = 62;

const map = noise(map_width, map_height, 10);
const grass_arr = noise(map_width * 12, map_height * 12, 1);

function rand(n)
{
    return Math.floor(Math.random() * n);
}

function addBlockAtRandomPos(tiles, id, zone = {x: 0, y: 0, w: 12, h: 12})
{
    let x, y;
    do
    {
        x = rand(zone.w) + zone.x;
        y = rand(zone.h) + zone.y;
    }
    while (tiles[y][x] != null);
    tiles[y][x] = id;
}

function addScatteredBlocksNoise(tiles, map_x, map_y, id, dispersion)
{
    for (let i = 0; i < 12; i++)
    {
        for (let j = 0; j < 12; j++)
        {
            if (tiles[i][j] == null && grass_arr[map_y * 12 + i][map_x * 12 + j] < dispersion)
            {
                tiles[i][j] = id;
            }
        }
    }
}

function addScatteredBlocksRandom(tiles, id, number)
{
    for (let i = 0; i < number; i++)
    {
        addBlockAtRandomPos(tiles, id);
    }
}

for (let i = 0; i < map_height; i++)
{
    for (let j = 0; j < map_width; j++)
    {
        let biome_type;
        const tiles = [];
        for (let k = 0; k < 12; k++)
        {
            const line = [];
            for (let l = 0; l < 12; l++)
            {
                line.push(null);
            }
            tiles.push(line);
        }
        if (map[i][j] < 0.49)
        {
            biome_type = 0;
            addScatteredBlocksRandom(tiles, blocks.wooden_log, rand(3) + 2);
            addScatteredBlocksNoise(tiles, j, i, blocks.berries, 0.3);
        }
        else if (map[i][j] < 0.53)
        {
            biome_type = 1;
            addScatteredBlocksNoise(tiles, j, i, blocks.grass, 0.4);
        }
        else if (map[i][j] < 0.61)
        {
            biome_type = 2;
            if (Math.random() < 0.1)
            {
                const structure = structures[rand(structures.length)];
                const structure_x = rand(11 - structure.w) + 1;
                const structure_y = rand(11 - structure.h) + 1;
                for (let k = 0; k < structure.h; k++)
                {
                    for (let l = 0; l < structure.w; l++)
                    {
                        switch (structure.arr[k][l])
                        {
                            case 1:
                                if (Math.random() >= 0.4)
                                {
                                    if (Math.random() < 0.3)
                                    {
                                        tiles[structure_y + k][structure_x + l] = blocks.desert_brick_0;
                                    }
                                    else
                                    {
                                        tiles[structure_y + k][structure_x + l] = blocks.desert_brick_1;
                                    }
                                }
                                break;
                            case 2:
                                if (Math.random() >= 0.1)
                                {
                                    tiles[structure_y + k][structure_x + l] = blocks.wooden_floor;
                                }
                        }
                    }
                }
                addBlockAtRandomPos(tiles, blocks.tombstone, {x: structure_x - 1, y: structure_y - 1, w: structure.w + 2, h: structure.h + 2});
            }
            addScatteredBlocksNoise(tiles, j, i, blocks.dead_grass, 0.3);
            addScatteredBlocksRandom(tiles, blocks.mushrooms, rand(3) + 2);
        }
        else
        {
            biome_type = 3;
        }
        map[i][j] =
        {
            biome_type: biome_type,
            height: map[i][j],
            tiles: tiles
        };
    }
}

const map_canvas = document.createElement("canvas");
const map_canvas_ctx = map_canvas.getContext("2d");

map_canvas.width = map_width;
map_canvas.height = map_height;

for (let i = 0; i < map_height; i++)
{
    for (let j = 0; j < map_width; j++)
    {
        switch (map[i][j].biome_type)
        {
            case 0:
                map_canvas_ctx.fillStyle = "#006F00";
                break;
            case 1:
                map_canvas_ctx.fillStyle = "#008800";
                break;
            case 2:
                map_canvas_ctx.fillStyle = "#B39559";
                break;
            case 3:
                map_canvas_ctx.fillStyle = "#5E5743";
        }
        map_canvas_ctx.fillRect(j, i, 1, 1);
    }
}

const map_image = new Image();
map_image.src = map_canvas.toDataURL();