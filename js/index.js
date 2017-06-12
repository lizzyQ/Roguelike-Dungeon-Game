"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InfoBox = function InfoBox(props) {
  return React.createElement(
    "div",
    { className: "infoContainer" },
    React.createElement(
      "h3",
      null,
      "Dungeon Crawler"
    ),
    React.createElement(
      "p",
      { className: "infoMessage" },
      props.info.message
    ),
    React.createElement(
      "p",
      null,
      "Level:",
      React.createElement(
        "span",
        null,
        " ",
        props.info.level
      )
    ),
    React.createElement(
      "p",
      null,
      "Weapon:",
      React.createElement(
        "span",
        null,
        " ",
        props.info.weapon
      )
    ),
    React.createElement(
      "p",
      null,
      "Health:",
      React.createElement(
        "span",
        null,
        " ",
        props.info.health
      ),
      React.createElement("progress", { value: props.info.health, max: "200" })
    ),
    React.createElement(
      "p",
      null,
      "xp:",
      React.createElement(
        "span",
        null,
        " ",
        props.info.xp
      )
    ),
    React.createElement(
      "p",
      null,
      "Next Level:",
      React.createElement(
        "span",
        null,
        " ",
        props.info.leftXp,
        " XP"
      )
    ),
    React.createElement(
      "button",
      { onClick: function onClick() {
          return props.newGame();
        } },
      "Play again"
    )
  );
};

var Dungeon = function (_React$Component) {
  _inherits(Dungeon, _React$Component);

  function Dungeon() {
    _classCallCheck(this, Dungeon);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this));

    _this.state = {
      ctx: null,
      canvasW: 600,
      canvasH: 420,
      tsize: 30
    };
    return _this;
  }

  Dungeon.prototype.componentWillMount = function componentWillMount() {
    this.initialCanvas();
  };

  Dungeon.prototype.initialCanvas = function initialCanvas() {
    var itemMap = this.props.itemMap,
        floorMap = this.props.floorMap,
        info = this.props.info;
    var loadImg = this.loadImg();
    var setCvData = this.setCvData(itemMap);

    document.addEventListener("keydown", this.handleKeyPress.bind(this));
    this.setState({
      imagesLoader: loadImg,
      gameOn: true,
      itemMap: itemMap,
      floorMap: floorMap,
      info: info,
      hero: setCvData.heroCor,
      camera: setCvData.camera
    });
  }; //initialCanvas Over

  Dungeon.prototype.loadImg = function loadImg() {
    var _this2 = this;

    var imgSrcs = ["https://github.com/lizzyQ/Roguelike-Dungeon-Game/blob/master/assets/tiles.png?raw=true", "https://github.com/lizzyQ/Roguelike-Dungeon-Game/blob/master/assets/floor.png?raw=true", "https://github.com/lizzyQ/Roguelike-Dungeon-Game/blob/master/assets/hero.png?raw=true"];
    var imageObj = new Array();
    //Assign onload handler to each image in array
    for (var i = 0; i < imgSrcs.length; i++) {
      imageObj[i] = new Image();
      imageObj[i].onload = function (value) {
        return function () {
          _this2.setState({ loaded: value }); //return !important
        };
      }(i); //why need (i)? ,is it a call back, what does this thing do?
      imageObj[i].src = imgSrcs[i];
    }
    return imageObj;
  };

  Dungeon.prototype.setCvData = function setCvData(map) {
    var cam = {},
        hero = {},
        imgSize = this.state.tsize,
        heroX = this.props.heroCor[0] * imgSize,
        heroY = this.props.heroCor[1] * imgSize,
        centerCvW = this.state.canvasW / 2,
        centerCvH = this.state.canvasH / 2;
    //EVERYTHING TO PX; heroXY is inGridPx and hero.x is inCanvasValue
    cam.maxX = (map.length - 1) * imgSize - this.state.canvasW; //600;
    cam.maxY = (map[0].length - 1) * imgSize - this.state.canvasH; //480;
    //sprite placed at the center of canvas
    hero.x = centerCvW;
    hero.y = centerCvH;
    // make the camera follow the sprite
    cam.x = heroX - centerCvW;
    cam.y = heroY - centerCvH;
    // clamp values
    cam.x = Math.max(0, Math.min(cam.x, cam.maxX));
    cam.y = Math.max(0, Math.min(cam.y, cam.maxY));

    // left and right sides
    if (heroX < centerCvW || heroX > this.state.canvasW + centerCvW) {
      hero.x = heroX - cam.x;
    }
    // top and bottom sides
    if (heroY < centerCvH || heroY > this.state.canvasH + centerCvH) {
      hero.y = heroY - cam.y;
    }
    return { camera: cam, heroCor: hero };
  };

  Dungeon.prototype.componentWillUnmount = function componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress.bind(this));
  };

  Dungeon.prototype.componentDidMount = function componentDidMount() {
    var ctx = this.refs.gameMap.getContext("2d");
    this.setState({ ctx: ctx });
  };

  Dungeon.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
    return this.state.gameOn;
  };

  Dungeon.prototype.componentDidUpdate = function componentDidUpdate() {
    this.reDrawCv();
  };

  Dungeon.prototype.reDrawCv = function reDrawCv() {
    var ctx = this.state.ctx,
        imgTile = this.state.imagesLoader[0],
        imgFloor = this.state.imagesLoader[1],
        imgHero = this.state.imagesLoader[2];
    //Didmount happens faster than load func so we call drawlayer func here
    ctx.clearRect(0, 0, this.state.canvasW, this.state.canvasH);
    this.drawLayer(this.state.floorMap, imgFloor);
    ctx.drawImage(imgHero, 0, 0, this.state.tsize, this.state.tsize, this.state.hero.x, this.state.hero.y, this.state.tsize, this.state.tsize);
    this.drawLayer(this.state.itemMap, imgTile);
  };

  Dungeon.prototype.drawLayer = function drawLayer(grid, img) {
    var ctx = this.state.ctx,
        map = grid.concat(),
        tsize = this.state.tsize;

    var startRow = Math.floor(this.state.camera.x / tsize),
        endRow = startRow + this.state.canvasW / tsize,
        startCol = Math.floor(this.state.camera.y / tsize),
        endCol = startCol + this.state.canvasH / tsize,

    //shift amount in px
    offsetX = -this.state.camera.x + startRow * tsize,
        offsetY = -this.state.camera.y + startCol * tsize;

    for (var j = startRow; j <= endRow; j++) {
      for (var i = startCol; i <= endCol; i++) {
        var tile = map[j][i],
            x = (j - startRow) * tsize + offsetX,
            //-30,0,30,60...570
        y = (i - startCol) * tsize + offsetY;
        if (tile !== 0) {
          // 0 are empty space
          ctx.drawImage(img, (tile - 1) * tsize, //decide which image we are using
          0, tsize, tsize, Math.round(x), //target x
          Math.round(y), //target y
          tsize, tsize);
        }
      }
    } //end of for loop 
  }; //end of drawlayer

  Dungeon.prototype.handleKeyPress = function handleKeyPress(e) {
    var direction = e.keyCode,
        dirx = 0,
        diry = 0;
    e.preventDefault();
    switch (direction) {
      case 38:
        diry = -1; //up
        break;
      case 40:
        diry = 1; //down
        break;
      case 37:
        dirx = -1; //left
        break;
      case 39:
        dirx = 1; //right
        break;
    }
    this.checkCollide(dirx, diry);
  };

  Dungeon.prototype.checkCollide = function checkCollide(dirx, diry) {
    var map = this.state.itemMap,
        size = this.state.tsize,
        row = Math.floor((this.state.camera.x + this.state.hero.x) / size),
        col = Math.floor((this.state.camera.y + this.state.hero.y) / size);

    if (dirx > 0) {
      //right
      row = Math.floor((this.state.camera.x + this.state.hero.x + 31) / size);
    } else if (dirx < 0) {
      //left
      row = Math.floor((this.state.camera.x + this.state.hero.x - 3) / size);
    } else if (diry > 0) {
      //down
      col = Math.floor((this.state.camera.y + this.state.hero.y + 31) / size);
    } else if (diry < 0) {
      //up
      col = Math.floor((this.state.camera.y + this.state.hero.y - 2) / size);
    }

    if (map[row][col] == 1) {
      return false;
    } else if (map[row][col] == 0) {
      this.heroMove(dirx, diry);
      this.cameraMove(dirx, diry);
    } else {
      this.updateInfo(map[row][col], row, col);
    }
  };

  Dungeon.prototype.updateInfo = function updateInfo(tile, itemR, itemC) {
    var weapon = { unarmed: 4, dagger: 10, axe: 20, maul: 40 }; //匕首，斧子，矛，大锤
    var enemy = [0, 0, 40, 80, 120, 180];
    var map = this.state.itemMap.concat(),
        data = {},
        info = this.state.info,
        weaponKey = info.weapon;

    switch (tile) {
      case 2:
      case 3:
      case 4:
      case 5:
        info.damage += info.level * 5 + weapon[weaponKey];
        info.message = "Damage: - " + info.damage;
        info.health -= tile * 2;
        info.xp += tile * 3;
        if (enemy[tile] - info.damage <= 0) {
          info.message = "Enemy Destroyed, Keep moving.";
          map[itemR][itemC] = 0;
          info.damage = 0;
        };
        break;
      case 6:
        info.health += 88; //magical drink
        map[itemR][itemC] = 0;
        break;
      case 7:
        info.weapon = "dagger";
        map[itemR][itemC] = 0;
        info.message = "You got a dagger, Better than nothing.";
        break;
      case 8:
        info.weapon = "axe";
        map[itemR][itemC] = 0;
        info.message = "An axe will help you make more damage";
        break;
      case 9:
        info.weapon = "maul";
        map[itemR][itemC] = 0;
        info.message = "Wow, that's a killer weapon you got there.";
        break;
      case 10:
        info.damage += info.level * 8 + weapon[weaponKey];
        info.message = "Boss is strong.";
        if (300 - info.damage <= 0) {
          map[itemR][itemC] = 0;
          info.message = "You Win!! ";
          info.damage = 0;
          this.gameOver(info.message);
        };
        info.health -= (tile - 5) * 2;
        info.xp += (tile - 4) * 3;
    }

    info.leftXp = info.level * 100 - info.xp;

    if (info.xp > 100 * info.level) {
      info.level = info.level + 1;
      info.message = "Good hit, Level up.";
    }

    if (info.health <= 0) {
      info.message = "Game Over!";
      this.gameOver(info.message);
    } else if (info.health > 0 && info.health < 20) {
      info.message = "You need to find the magical drink now.";
    }

    if (info.level >= 4) {
      info.message = "Find the boss and start the real battle";
      var bosscor = this.props.bossCor;
      map[bosscor[0]][bosscor[1]] = 10;
    }

    this.setState({
      info: info,
      map: map
    }, function () {
      this.props.updateInfo(this.state.info);
    });
  };

  Dungeon.prototype.heroMove = function heroMove(dirx, diry) {
    var hero = {},
        x = this.state.hero.x,
        y = this.state.hero.y,
        speed = 1.256,
        //px per press
    maxX = this.state.canvasW - this.state.tsize,
        maxY = this.state.canvasH - this.state.tsize;
    x += dirx * speed;
    y += diry * speed;
    hero.x = Math.max(0, Math.min(x, maxX));
    hero.y = Math.max(0, Math.min(y, maxY));

    this.setState({ hero: hero });
  };

  Dungeon.prototype.cameraMove = function cameraMove(dirx, diry) {
    var cam = {},
        x = this.state.camera.x,
        y = this.state.camera.y,
        speed = 1.256;
    cam.maxX = this.state.camera.maxX, //600 camX max can go 600 but no more
    cam.maxY = this.state.camera.maxY; //480 camY cam go 0~480 and mo more
    x += dirx * speed;
    y += diry * speed;
    //clamp values
    cam.x = Math.max(0, Math.min(x, cam.maxX));
    cam.y = Math.max(0, Math.min(y, cam.maxY));

    this.setState({ camera: cam });
  };

  Dungeon.prototype.gameOver = function gameOver(message) {
    this.setState({ gameOn: false });
    var ctx = this.state.ctx;
    ctx.clearRect(0, 0, this.state.canvasW, this.state.canvasH);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.state.canvasW, this.state.canvasH);
    ctx.font = "50px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(message, 180, 180);
  };

  Dungeon.prototype.render = function render() {
    return React.createElement(
      "div",
      { className: "mapContainer", onKeyPress: this.handleKeyPress.bind(this) },
      React.createElement("canvas", {
        ref: "gameMap",
        width: this.state.canvasW,
        height: this.state.canvasH
      })
    );
  };

  return Dungeon;
}(React.Component);

var Game = function (_React$Component2) {
  _inherits(Game, _React$Component2);

  function Game() {
    _classCallCheck(this, Game);

    var _this3 = _possibleConstructorReturn(this, _React$Component2.call(this));

    _this3.state = {
      width: 40,
      height: 30,
      maxCell: 10
    }; //state end
    return _this3;
  } //constructor end

  Game.prototype.componentWillMount = function componentWillMount() {
    this.initialGame();
  };
  // initial grid and get the cell structure

  Game.prototype.initialGame = function initialGame() {
    var info = { level: 1, xp: 0, leftXp: 100, health: 100, weapon: 'unarmed', damage: 4,
      message: "The boss will show in level 4. Press arrow keys to move around. Let's Go!"
    },
        grid = this.initialGrid(),
        cells = this.setupCells(grid),
        roomMap = this.setupRooms(grid, cells),
        landMap = this.setupLandMap(roomMap),
        itemMap = this.setupItemMap(landMap, cells.length);

    this.setState({
      info: info,
      grid: grid,
      cells: cells,
      rooms: roomMap.rooms,
      landMap: landMap,
      itemMap: itemMap[0],
      floorMap: itemMap[1],
      heroCor: itemMap[2],
      bossCor: itemMap[3]
    });
  };

  Game.prototype.initialGrid = function initialGrid() {
    var gridW = this.state.width,
        gridH = this.state.height,
        grid = [];
    for (var gw = 0; gw < gridW; gw++) {
      grid.push(Array(gridH).fill(2));
    }
    return grid;
  };

  Game.prototype.setupCells = function setupCells(grid) {
    var gridW = this.state.width,
        gridH = this.state.height,
        maxCell = this.state.maxCell,
        cellStructure = [];

    for (var w = 0; w < gridW / maxCell; w++) {
      for (var h = 0; h < gridH / maxCell; h++) {
        var cells = {
          tl: [w * maxCell, h * maxCell],
          tr: [w * maxCell, h * maxCell + maxCell - 1],
          bl: [w * maxCell + maxCell - 1, h * maxCell],
          br: [w * maxCell + maxCell - 1, h * maxCell + maxCell - 1]
        };
        cellStructure.push(cells);
        // grid[w*maxCell][h*maxCell] = 1; //tl
        // grid[w*maxCell][h*maxCell+ maxCell-1] = 2; //tr
        // grid[w*maxCell + maxCell-1][h*maxCell] = 3; //bl
        // grid[w*maxCell + maxCell-1][h*maxCell + maxCell-1] = 4;//br   
      }
    }
    return cellStructure;
  };

  Game.prototype.setupRooms = function setupRooms(grid, cells) {
    var copyGrid = grid.concat(),
        copyCells = cells.concat(),
        maxCell = this.state.maxCell,
        roomNum = this.state.width / maxCell * (this.state.height / maxCell),
        conners = Object.keys(copyCells[0]),
        rooms = [];

    for (var r = 0; r < roomNum; r++) {
      var a = undefined,
          b = undefined,
          roomW = this.getRandomInt(5, maxCell - 2),
          //room size: 4*5 ~ 9*9
      roomH = this.getRandomInt(4, maxCell - 2),
          rdmIdx = this.getRandomInt(0, copyCells.length - 1),
          // get a random cell
      rdmC = this.getRandomInt(0, conners.length - 1),
          // select a random conner
      conner = copyCells[rdmIdx][conners[rdmC]];
      // get the room's upper left conner =>  array point of view
      switch (conners[rdmC]) {
        case 'tl':
          a = conner[0] + 1;
          b = conner[1] + 1;
          break;
        case 'tr':
          a = conner[0] + 1;
          b = conner[1] - roomH;
          break;
        case 'bl':
          a = conner[0] - roomW;
          b = conner[1] + 1;
          break;
        case 'br':
          a = conner[0] - roomW;
          b = conner[1] - roomH;
          break;
      }
      // get top, left, bottom right of each room
      rooms.push([a, b, a + roomW, b + roomH]);
      //fill the rooms
      for (var w = a; w < a + roomW; w++) {
        for (var h = b; h < b + roomH; h++) {
          copyGrid[w][h] = 1;
        }
      }
      copyCells.splice(rdmIdx, 1);
    }
    return { rooms: rooms, grid: copyGrid };
  };

  Game.prototype.getRandomInt = function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  Game.prototype.setupLandMap = function setupLandMap(roomMap) {
    var sameRow = [[], [], [], []],
        sameCol = [[], [], []],
        rooms = roomMap.rooms,
        copyGrid = roomMap.grid;

    for (var j = 0; j < rooms.length; j++) {
      var room = rooms[j],
          top = room[0],
          left = room[1];
      if (top < 10) {
        sameRow[0].push(room);
      } else if (top > 0 && top < 20) {
        sameRow[1].push(room);
      } else if (top > 20 && top < 30) {
        sameRow[2].push(room);
      } else if (top > 30) {
        sameRow[3].push(room);
      }

      if (left < 10) {
        sameCol[0].push(room);
      } else if (left > 10 && left < 20) {
        sameCol[1].push(room);
      } else if (left > 20) {
        sameCol[2].push(room);
      }
    }
    //room = [t,l,b,r];     
    for (var j = 0; j < sameRow.length; j++) {
      if (sameRow[j].length > 1) {
        var roomsInRow = sameRow[j];
        roomsInRow.sort(function (a, b) {
          return a[1] - b[1];
        });

        for (var i = 0; i < roomsInRow.length - 1; i++) {
          var x0 = Math.max(roomsInRow[i][0], roomsInRow[i + 1][0]),
              y0 = Math.min(roomsInRow[i][2], roomsInRow[i + 1][2]),
              x1 = roomsInRow[i][3],
              y1 = roomsInRow[i + 1][1],
              scale = y0 - x0 < 3 ? y0 : x0 + 2;
          for (var row = x0; row < scale; row++) {
            for (var col = x1; col < y1; col++) {
              copyGrid[row][col] = 1;
            }
          }
        } // End of roomsInRow loop     
      } //End of if sameRow
    }

    for (var j = 0; j < sameCol.length; j++) {
      if (sameCol[j].length > 1) {
        var roomsInCol = sameCol[j];
        roomsInCol.sort(function (a, b) {
          return a[0] - b[0];
        });

        for (var i = 0; i < roomsInCol.length - 1; i++) {
          var x0 = roomsInCol[i][2],
              //room1 butt
          y0 = roomsInCol[i + 1][0],
              //room2 top
          x1 = Math.max(roomsInCol[i][1], roomsInCol[i + 1][1]),
              y1 = Math.min(roomsInCol[i][3], roomsInCol[i + 1][3]),
              scale = y1 - x1 < 3 ? y1 : x1 + 2;
          for (var row = x0; row < y0; row++) {
            for (var col = x1; col < scale; col++) {
              copyGrid[row][col] = 1;
            }
          }
        } // End of roomsInRow loop     
      } //End of if sameRow
    }
    return copyGrid;
  };

  Game.prototype.setupItemMap = function setupItemMap(landMap, roomN) {
    var grid = landMap.concat(),
        floorMap = [],
        itemMap = [],
        possibleItemsP = [];

    for (var r = 0; r < grid.length; r++) {
      itemMap.push([]);
      floorMap.push([]);
      for (var c = 0; c < grid[r].length; c++) {
        floorMap[r].push(0); //set whole map to empty
        itemMap[r].push(1); //set the whole map to walls
        if (grid[r][c] == 1) {
          //if it's floor
          possibleItemsP.push([r, c]);
          floorMap[r][c] = 1;
          itemMap[r][c] = 0;
        }
      }
    }

    for (var i = 0; i < roomN * 3; i++) {
      //Sprinkle 24 enemys in random floors
      var item = this.getRandomInt(2, 5);
      var rdmIdx = this.getRandomInt(0, possibleItemsP.length - 1);
      var a = possibleItemsP[rdmIdx][0],
          b = possibleItemsP[rdmIdx][1];

      itemMap[a][b] = item;
      possibleItemsP.splice(rdmIdx, 1);
    }

    for (var i = 0; i < roomN * 2; i++) {
      //Sprinkle 12 items in random floors
      var item = this.getRandomInt(7, 9);
      var rdmIdx = this.getRandomInt(0, possibleItemsP.length - 1);
      var a = possibleItemsP[rdmIdx][0],
          b = possibleItemsP[rdmIdx][1];
      if (i < roomN) {
        itemMap[a][b] = item;
      } else {
        itemMap[a][b] = 6;
      }
      possibleItemsP.splice(rdmIdx, 1);
    }

    var bossIdx = this.getRandomInt(0, possibleItemsP.length);
    var bossCor = possibleItemsP[bossIdx];

    var heroIdx = this.getRandomInt(0, possibleItemsP.length);
    var heroCor = possibleItemsP[heroIdx];
    //console.log(JSON.stringify(copyGrid));
    return [itemMap, floorMap, heroCor, bossCor];
  };

  Game.prototype.updateInfo = function updateInfo(info) {
    this.setState({ info: info });
  };

  Game.prototype.onNewGame = function onNewGame() {
    this.setState({ info: {},
      grid: [],
      cells: [],
      rooms: [],
      landMap: [],
      itemMap: [],
      floorMap: [],
      heroCor: [],
      bossCor: []
    }, function () {
      this.refs.dungeon.initialCanvas();
    });
    this.initialGame();
  };

  Game.prototype.render = function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(InfoBox, { info: this.state.info,
        newGame: this.onNewGame.bind(this) }),
      React.createElement(Dungeon, { ref: "dungeon",
        floorMap: this.state.floorMap,
        itemMap: this.state.itemMap,
        heroCor: this.state.heroCor,
        info: this.state.info,
        updateInfo: this.updateInfo.bind(this),
        bossCor: this.state.bossCor
      })
    );
  };

  return Game;
}(React.Component);

ReactDOM.render(React.createElement(Game, null), document.getElementById('container'));