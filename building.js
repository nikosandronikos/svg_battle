function Building(x, y, size, health, owner, map, sprite)
{
    Building.baseConstructor.call(this, x, y, sprite);

    this.map = map;
    this.size = size - 1;
    this.owner = owner;
    this.health = health;

    if (sprite != undefined)
    {
        this.setSprite(sprite);
    }
}

KevLinDev.extend(Building, RenderMapObject)

Building.prototype.setSprite =
    function(sprite)
    {
        this.sprite = sprite;
        this.sprite.setPosition(gamemap_get_map_screenx(this.x), gamemap_get_map_screeny(this.x, this.y));
        this.sprite.setText(this.health);
    }

Building.prototype.takeDamage =
    function(dmg)
    {
        this.health -= dmg;
        this.sprite.changeText(this.health);
    }

Building.prototype.isDead =
    function()
    {
        return (this.health < 0 ? true : false);
    }

Building.prototype.inBuilding =
    function(x, y)
    {
        if (hexmap_distance(x, y, this.x, this.y) <= this.size)
        {
            return true;
        }
        return false;
    }

Building.prototype.getBuildingTiles =
    function()
    {
        return this.map.getSurroundingHex(this.x, this.y, this.size);
    }

function BuildingStore()
{
    this.store = Array();
}

BuildingStore.prototype.addBuilding =
    function(building)
    {
        this.store.push(building);
    }

BuildingStore.prototype.isBuilding =
    function(x, y)
    {
        var building = this.getBuilding(x, y);
        return (building === undefined ? false : true);
    }


BuildingStore.prototype.getBuilding =
    function(x, y)
    {
        var i;

        for (i = 0; i < this.store.length; i++)
        {
            if (this.store[i].inBuilding(x, y))
            {
                return this.store[i];
            }
        }

        return undefined;
    }

BuildingStore.prototype.getBuildingList =
    function()
    {
        return this.store;
    }

function BuildingIterator(building_store, ignore_army)
{
    if (typeof(ignore_army)==='undefined') ignore_army = undefined;
    this.building_store = building_store.store;
    this.ignore_army = ignore_army;
    this.current = -1;
}

BuildingIterator.prototype.get =
    function()
    {
        return this.building_store[this.current];
    }
    
BuildingIterator.prototype.moveNext =
    function()
    {
        this.current += 1;

        while (this.current < this.building_store.length && this.building_store[this.current].owner == this.ignore_army)
        {
            this.current += 1;
        }

        if (this.current >= this.building_store.length)
        {
            return false;
        }
        
        return true;
    } 
