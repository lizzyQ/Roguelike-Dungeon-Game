## Synopsis

Rogue-like Dungeon Crawler is a mini role play game. 
To win the game, the user moves anywhere within the map's boundaries, discovering health items, get weapons, beat enemies,  
find and beat the boss.
The user can see their health,level, experience, and weapon. when encounter an enemy, user and enemy take turns damaging 
each other until one loses. User' damage was based off of the level and weapon. The enemy does damage based off of its level. 
When the enemy goes away, the user gets XP, which eventually increases the level.
Much of the map is hidden. When User take a step, all spaces that are within a certain number of spaces from user are revealed.

---
## Preview

![Project Preview](https://github.com/lizzyQ/Roguelike-Dungeon-Game/blob/master/assets/preview.png?raw=true)

[*Demo*](https://codepen.io/lizzyQ/full/JWVQXy/). 

***
## small bug
Sometimes, It looks like the hero/user is moving through the enemy, but that's because they are in different tiles.
The user has to move around to match the eaxct tile the items/enemy at to fight. 

***

## code Note
   Think through how to match 'array[row][col]' with 'canvas(x,y)'.
   Grid(nested array) and canvas, they visual differently. 
   when do fillRect(x,y,w,h), x is the distance to left, y is the distance to top
   but in grid[x][y],x is the distance to top, y is the distance to left
   e.g. fillRect x:2, y:1 (left) vs. grid[2][1] on the right

         0 0 0 0 0 0 0    |    0 0 0 0 0 0 0
         0 0 * 0 0 0 0    |    0 0 0 0 0 0 0 
         0 0 0 0 0 0 0    |    0 * 0 0 0 0 0 
         0 0 0 0 0 0 0    |    0 0 0 0 0 0 0
    
## Helpful reference  

   Followed [this one](http://www.roguebasin.com/index.php?title=Grid_Based_Dungeon_Generator) to sucessfully built the map.
   - http://www.roguebasin.com/index.php?title=Grid_Based_Dungeon_Generator -
***
Tilemap reference
https://developer.mozilla.org/en-US/docs/Games/Techniques/Tilemaps/Square_tilemaps_implementation%3A_Scrolling_maps

***

## lesson learned
 Had better understanding of react render fire time.
 This order list may help.
   Parent component Will Mount
   Parent component Render divs
   Canvas/child component Will Mount
   Canvas/child component Render divs
   Canvas/child component Did Mount
   Parent component Did Mount
   Canvas/child component Render again
   image loaded
   
  Rendered: React has converted your virtual DOM elements (specified in the render method) into real DOM elements and attached them to the DOM.
  Loaded: Image data or other remote content has downloaded completely (or failed to download).
 
 Tried to make react ,canvas, and image loader work together, 
 and I spent quite a bit time try to put image.onload function inside the component will mount, 
 The code works, but I still not totally understand how did it work.
