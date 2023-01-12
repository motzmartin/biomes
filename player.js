function check(n)
{
    return n >= 0 && n < 12;
}

class Player
{
    constructor()
    {
        this.x = 0;
        this.y = 0;

        this.map_x = 0;
        this.map_y = 0;

        this.sprite = 0;
        this.sprite_x = 0;
        this.sprite_y = 0;

        this.hp = 100;
        this.hunger = 100;
        this.exp = 0;

        this.hunger_cooldown = 0;

        this.inventory = [];
        this.item_selected = 0;
    }

    update(keyboard)
    {
        const x_temp = this.x;
        if (keyboard["q"] != keyboard["d"])
        {
            let acceleration_x = 0;
            if (keyboard["q"])
            {
                acceleration_x = keyboard[" "] ? -50 : -1;
            }
            if (keyboard["d"])
            {
                acceleration_x = keyboard[" "] ? 50 : 1;
            }
            this.x += acceleration_x;
            if (acceleration_x < 0 && this.x < -16)
            {
                if (this.map_x == 0)
                {
                    this.x = -16;
                }
                else
                {
                    this.map_x--;
                    this.x = 192;
                }
            }
            else if (acceleration_x > 0 && this.x > 192)
            {
                if (this.map_x == map_width - 1)
                {
                    this.x = 192;
                }
                else
                {
                    this.map_x++;
                    this.x = -16;
                }
            }
            else
            {
                const tiles = map[this.map_y][this.map_x].tiles;
                const tile_y_0 = Math.floor(this.y / 16);
                const tile_y_1 = Math.floor((this.y + 15) / 16);
                if (acceleration_x < 0)
                {
                    const tile_x = Math.floor(this.x / 16);
                    if (
                        check(tile_x) &&
                        (
                            (check(tile_y_0) && tiles[tile_y_0][tile_x] != null && blocks_properties[tiles[tile_y_0][tile_x]].player_collision) ||
                            (check(tile_y_1) && tiles[tile_y_1][tile_x] != null && blocks_properties[tiles[tile_y_1][tile_x]].player_collision)
                        )
                    )
                    {
                        this.x = (tile_x + 1) * 16;
                    }
                }
                else if (acceleration_x > 0)
                {
                    const tile_x = Math.floor((this.x + 15) / 16);
                    if (
                        check(tile_x) &&
                        (
                            (check(tile_y_0) && tiles[tile_y_0][tile_x] != null && blocks_properties[tiles[tile_y_0][tile_x]].player_collision) ||
                            (check(tile_y_1) && tiles[tile_y_1][tile_x] != null && blocks_properties[tiles[tile_y_1][tile_x]].player_collision)
                        )
                    )
                    {
                        this.x = (tile_x - 1) * 16;
                    }
                }
            }
        }

        const y_temp = this.y;
        if (keyboard["z"] != keyboard["s"])
        {
            let acceleration_y = 0;
            if (keyboard["z"])
            {
                acceleration_y = keyboard[" "] ? -50 : -1;
            }
            if (keyboard["s"])
            {
                acceleration_y = keyboard[" "] ? 50 : 1;
            }
            this.y += acceleration_y;
            if (acceleration_y < 0 && this.y < -16)
            {
                if (this.map_y == 0)
                {
                    this.y = -16;
                }
                else
                {
                    this.map_y--;
                    this.y = 192;
                }
            }
            else if (acceleration_y > 0 && this.y > 192)
            {
                if (this.map_y == map_height - 1)
                {
                    this.y = 192;
                }
                else
                {
                    this.map_y++;
                    this.y = -16;
                }
            }
            else
            {
                const tiles = map[this.map_y][this.map_x].tiles;
                const tile_x_0 = Math.floor(this.x / 16);
                const tile_x_1 = Math.floor((this.x + 15) / 16);
                if (acceleration_y < 0)
                {
                    const tile_y = Math.floor(this.y / 16);
                    if (
                        check(tile_y) &&
                        (
                            (check(tile_x_0) && tiles[tile_y][tile_x_0] != null && blocks_properties[tiles[tile_y][tile_x_0]].player_collision) ||
                            (check(tile_x_1) && tiles[tile_y][tile_x_1] != null && blocks_properties[tiles[tile_y][tile_x_1]].player_collision)
                        )
                    )
                    {
                        this.y = (tile_y + 1) * 16;
                    }
                }
                else if (acceleration_y > 0)
                {
                    const tile_y = Math.floor((this.y + 15) / 16);
                    if (
                        check(tile_y) &&
                        (
                            (check(tile_x_0) && tiles[tile_y][tile_x_0] != null && blocks_properties[tiles[tile_y][tile_x_0]].player_collision) ||
                            (check(tile_x_1) && tiles[tile_y][tile_x_1] != null && blocks_properties[tiles[tile_y][tile_x_1]].player_collision)
                        )
                    )
                    {
                        this.y = (tile_y - 1) * 16;
                    }
                }
            }
        }

        this.hunger_cooldown++;
        if (this.hunger_cooldown >= 180)
        {
            if (this.hunger > 0)
            {
                this.hunger--;
            }
            else
            {
                this.hp--;
            }
            this.hunger_cooldown = 0;
        }

        if (x_temp < this.x)
        {
            this.sprite_y = 1;
        }
        else if (x_temp > this.x)
        {
            this.sprite_y = 3;
        }
        else if (y_temp < this.y)
        {
            this.sprite_y = 0;
        }
        else if (y_temp > this.y)
        {
            this.sprite_y = 2;
        }

        if (this.x == x_temp && this.y == y_temp)
        {
            this.sprite = 0;
        }

        this.sprite++;
        if (this.sprite < 7)
        {
            this.sprite_x = 0;
        }
        else if (this.sprite >= 7 && this.sprite < 14)
        {
            this.sprite_x = 1;
        }
        else if (this.sprite >= 14 && this.sprite < 21)
        {
            this.sprite_x = 2;
        }
        else if (this.sprite >= 21 && this.sprite < 28)
        {
            this.sprite_x = 3;
        }
        else
        {
            this.sprite = 0;
        }
    }
}