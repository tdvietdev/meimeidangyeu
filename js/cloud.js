var Cloud, CloudProcessor, Coordinate, myclouds;

Coordinate = (function() {
  function Coordinate(x, y) {
    this.x = x;
    this.y = y;
  }

  Coordinate.prototype.add = function(byx, byy) {
    if (arguments.length === 1) {
      this.x = this.x + byx;
      this.y = this.y + byx;
    } else {
      this.x = this.x + byx;
      this.y = this.y + byy;
    }
    return this;
  };

  return Coordinate;

})();

Cloud = (function() {
  function Cloud(location, scale, opacity, rate) {
    this.location = location;
    this.scale = scale;
    this.opacity = opacity;
    this.rate = rate;
    this.alive = true;
  }

  Cloud.prototype.dead = function() {
    return this.alive = false;
  };

  return Cloud;

})();

CloudProcessor = (function() {
  function CloudProcessor(number) {
    var msie, trident, useragent;
    this.number = number;
    this.minscale = 50;
    this.maxscale = 200;
    this.minxpercent = 0;
    this.maxxpercent = 100;
    this.minypercent = 0;
    this.maxypercent = 100;
    this.minopacity = 50;
    this.maxopacityt = 100;
    this.minxrate = 50;
    this.maxxrate = 500;
    this.minyrate = 0;
    this.maxyrate = 0;
    this.frames = 30;
    this.canvas = $("#cloud")[0];
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.loaded = false;
    this.running = true;
    this.cloudimage = new Image();
    this.cloudimage.onload = (function(_this) {
      return function() {
        return _this._doneLoading();
      };
    })(this);
    useragent = $(window)[0].navigator.userAgent;
    msie = useragent.indexOf("MSIE");
    trident = useragent.indexOf("Trident");
    if (msie > 0 || trident > 0) {
      this.cloudimage.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/309492/cloud.png";
    } else {
      this.cloudimage.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/309492/cloud.svg";
    }
  }

  CloudProcessor.prototype._doneLoading = function() {
    var i, lp, ref;
    this.cloudwidth = this.cloudimage.width;
    this.cloudheight = this.cloudimage.height;
    this.clouds = new Array();
    for (lp = i = 0, ref = this.number; 0 <= ref ? i <= ref : i >= ref; lp = 0 <= ref ? ++i : --i) {
      this.spawn();
    }
    this.loaded = true;
    setInterval((function(_this) {
      return function() {
        return _this.run();
      };
    })(this), 1000 / this.frames);
    return $(window).resize((function(_this) {
      return function() {
        return _this.resize();
      };
    })(this));
  };

  CloudProcessor.prototype.resize = function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    return this;
  };

  CloudProcessor.prototype.spawn = function() {
    var child;
    child = this.makecloud(false);
    this.clouds.push(child);
    return this;
  };

  CloudProcessor.prototype.makecloud = function(offscreen) {
    var child, guesscloudheight, guesscloudwidth, height, opacity, scalefactor, width, x, xrate, y, yrate;
    if (offscreen == null) {
      offscreen = false;
    }
    width = $("#cloud").width();
    height = $("#cloud").height();
    scalefactor = this.randNumber(this.minscale, this.maxscale) / 100;
    x = Math.floor(width * (this.randNumber(this.minxpercent, this.maxxpercent) / 100));
    y = Math.floor(height * (this.randNumber(this.minypercent, this.maxypercent) / 100));
    guesscloudwidth = Math.floor(this.cloudwidth * scalefactor);
    guesscloudheight = Math.floor(this.cloudheight * scalefactor);
    y = Math.min(y, height - guesscloudheight);
    x = Math.min(x, width - guesscloudwidth);
    xrate = this.randNumber(this.minxrate, this.maxxrate) / this.frames;
    yrate = this.randNumber(this.minyrate, this.maxyrate) / this.frames;
    if (offscreen === true) {
      if (xrate === 0) {
        y = -guesscloudheight;
      } else if (yrate === 0) {
        x = -guesscloudwidth;
      } else {
        y = -guesscloudheight;
        if (this.randNumber(0, 1) === 1) {
          x = -x / 2;
        }
      }
    }
    opacity = this.randNumber(this.minopacity, this.maxopacityt) / 100;
    child = new Cloud(new Coordinate(x, y), scalefactor, opacity, new Coordinate(xrate, yrate));
    return child;
  };

  CloudProcessor.prototype.update = function(id) {
    var at, height, rate, width;
    if (this.clouds[id].alive === false) {
      return this;
    }
    width = $("#cloud").width();
    height = $("#cloud").height();
    rate = this.clouds[id].rate;
    this.clouds[id].location.add(rate.x, rate.y);
    at = this.clouds[id].location;
    if (rate.y === 0) {
      if (at.x > width + this.cloudwidth) {
        this.clouds[id].dead();
      }
    } else if (rate.x === 0) {
      if (at.y > height + this.cloudheight) {
        this.clouds[id].dead();
      }
    } else {
      if (at.x > width + this.cloudwidth && at.y > height + this.cloudheight) {
        this.clouds[id].dead();
      }
    }
    return this;
  };

  CloudProcessor.prototype.respawn = function(id) {
    if (this.clouds[id].alive === true) {
      return this;
    }
    return this.clouds[id] = this.makecloud(true);
  };

  CloudProcessor.prototype.updateAll = function() {
    var i, lp, ref, results;
    results = [];
    for (lp = i = 0, ref = this.number; 0 <= ref ? i <= ref : i >= ref; lp = 0 <= ref ? ++i : --i) {
      this.update(lp);
      results.push(this.respawn(lp));
    }
    return results;
  };

  CloudProcessor.prototype.draw = function(id) {
    var child, h, location, w;
    child = this.clouds[id];
    location = child.location;
    w = Math.floor(this.cloudwidth * child.scale);
    h = Math.floor(this.cloudheight * child.scale);
    this.ctx.save();
    this.ctx.globalAlpha = child.opacity;
    this.ctx.drawImage(this.cloudimage, location.x, location.y, w, h);
    this.ctx.restore();
    return this;
  };

  CloudProcessor.prototype.drawAll = function() {
    var height, i, lp, ref, results, width;
    width = $("#cloud").width();
    height = $("#cloud").height();
    this.ctx.clearRect(0, 0, width, height);
    results = [];
    for (lp = i = 0, ref = this.number; 0 <= ref ? i <= ref : i >= ref; lp = 0 <= ref ? ++i : --i) {
      results.push(this.draw(lp));
    }
    return results;
  };

  CloudProcessor.prototype.run = function() {
    this.updateAll();
    return this.drawAll();
  };

  CloudProcessor.prototype.randNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };

  return CloudProcessor;

})();

myclouds = new CloudProcessor(2);
