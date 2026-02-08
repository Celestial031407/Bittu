(function() {
  var canvas = document.getElementById("bokeh-bg");
  if (!canvas || typeof createjs === "undefined") return;

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w = window.innerWidth;
  var h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";

  var stage = new createjs.Stage(canvas);
  stage.scaleX = stage.scaleY = dpr;

  // Soft dark gradient background (deeper at edges)
  var bg = new createjs.Shape();
  function drawBg() {
    var g = bg.graphics;
    g.clear();
    g.beginLinearGradientFill(["#0a0610", "#150a12", "#0d0710"], [0, 0.5, 1], 0, 0, w, h);
    g.drawRect(0, 0, w, h);
  }
  drawBg();
  stage.addChild(bg);

  // ----- Layer 1: Very soft bloom orbs (slow, dreamy) -----
  var bloomContainer = new createjs.Container();
  var bloomList = [];
  var bloomColors = [
    "rgba(255, 182, 193, 0.08)",
    "rgba(255, 105, 135, 0.06)",
    "rgba(255, 218, 224, 0.07)"
  ];
  for (var b = 0; b < 6; b++) {
    var radius = 120 + Math.random() * 180;
    var circle = new createjs.Shape();
    circle.graphics.beginFill(bloomColors[b % bloomColors.length]).drawCircle(0, 0, radius);
    circle.x = Math.random() * (w + radius) - radius * 0.5;
    circle.y = Math.random() * (h + radius) - radius * 0.5;
    circle.regX = radius;
    circle.regY = radius;
    bloomContainer.addChild(circle);
    bloomList.push({
      shape: circle,
      phase: Math.random() * Math.PI * 2,
      radius: radius
    });
  }
  stage.addChild(bloomContainer);

  // ----- Layer 2: Bokeh circles — drift, pulse, gentle rotation -----
  var bokehContainer = new createjs.Container();
  var bokehList = [];
  var pinkColors = [
    "rgba(255, 182, 193, 0.42)",
    "rgba(255, 105, 135, 0.38)",
    "rgba(255, 192, 203, 0.45)",
    "rgba(219, 112, 147, 0.32)",
    "rgba(255, 160, 122, 0.28)",
    "rgba(255, 218, 224, 0.25)",
    "rgba(255, 228, 232, 0.2)"
  ];

  for (var i = 0; i < 100; i++) {
    var radius = 18 + Math.random() * 75;
    var x = Math.random() * (w + radius * 2) - radius;
    var y = Math.random() * (h + radius * 2) - radius;
    var color = pinkColors[Math.floor(Math.random() * pinkColors.length)];
    var circle = new createjs.Shape();
    circle.graphics.beginFill(color).drawCircle(0, 0, radius);
    circle.x = x;
    circle.y = y;
    circle.regX = radius;
    circle.regY = radius;
    bokehContainer.addChild(circle);
    bokehList.push({
      shape: circle,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.2,
      baseScale: 0.88 + Math.random() * 0.28,
      phase: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      radius: radius
    });
  }
  stage.addChild(bokehContainer);

  // ----- Layer 3: Sparkles (tiny twinkling dots) -----
  var sparkleContainer = new createjs.Container();
  var sparkleList = [];
  for (var s = 0; s < 45; s++) {
    var size = 2 + Math.random() * 3;
    var dot = new createjs.Shape();
    dot.graphics.beginFill("rgba(255, 255, 255, 0.9)").drawCircle(0, 0, size);
    dot.x = Math.random() * w;
    dot.y = Math.random() * h;
    dot.regX = size;
    dot.regY = size;
    sparkleContainer.addChild(dot);
    sparkleList.push({
      shape: dot,
      phase: Math.random() * Math.PI * 2,
      baseAlpha: 0.3 + Math.random() * 0.5
    });
  }
  stage.addChild(sparkleContainer);

  // ----- Layer 4: Floating hearts ♥ -----
  var heartsContainer = new createjs.Container();
  var heartShapes = [];
  var heartChars = ["♥", "💕", "💗"];
  for (var j = 0; j < 28; j++) {
    var heart = new createjs.Text(heartChars[j % 3], "bold " + (18 + Math.floor(Math.random() * 20)) + "px Arial", "rgba(255, 182, 193, 0.7)");
    heart.textAlign = "center";
    heart.regX = heart.getMeasuredWidth() / 2;
    heart.regY = heart.getMeasuredHeight() / 2;
    heart.x = Math.random() * w;
    heart.y = Math.random() * h;
    heart.scaleX = heart.scaleY = 0.5 + Math.random() * 0.9;
    heartsContainer.addChild(heart);
    heartShapes.push({
      shape: heart,
      vy: -0.2 - Math.random() * 0.45,
      wobble: (Math.random() - 0.5) * 0.4,
      phase: Math.random() * Math.PI * 2
    });
  }
  stage.addChild(heartsContainer);

  // ----- Layer 5: Tiny rings 💍 (cute propose touch) -----
  var ringsContainer = new createjs.Container();
  var ringShapes = [];
  for (var r = 0; r < 8; r++) {
    var ring = new createjs.Text("💍", (14 + Math.floor(Math.random() * 10)) + "px Arial", "rgba(255, 255, 255, 0.5)");
    ring.textAlign = "center";
    ring.regX = ring.getMeasuredWidth() / 2;
    ring.regY = ring.getMeasuredHeight() / 2;
    ring.x = Math.random() * w;
    ring.y = Math.random() * h;
    ring.scaleX = ring.scaleY = 0.4 + Math.random() * 0.4;
    ringsContainer.addChild(ring);
    ringShapes.push({
      shape: ring,
      vy: -0.08 - Math.random() * 0.12,
      phase: Math.random() * Math.PI * 2
    });
  }
  stage.addChild(ringsContainer);

  var time = 0;

  function tick() {
    time += 0.018;

    // Bloom orbs — very slow pulse
    for (var b = 0; b < bloomList.length; b++) {
      var bl = bloomList[b];
      var scale = 1 + 0.12 * Math.sin(time * 0.5 + bl.phase);
      bl.shape.scaleX = bl.shape.scaleY = scale;
      bl.shape.alpha = 0.7 + 0.2 * Math.sin(time * 0.4 + bl.phase * 0.7);
    }

    // Bokeh: drift + pulse + slight rotation
    for (var i = 0; i < bokehList.length; i++) {
      var b = bokehList[i];
      b.shape.x += b.vx;
      b.shape.y += b.vy;
      if (b.shape.x < -b.radius * 2) b.shape.x = w + b.radius;
      if (b.shape.x > w + b.radius * 2) b.shape.x = -b.radius;
      if (b.shape.y < -b.radius * 2) b.shape.y = h + b.radius;
      if (b.shape.y > h + b.radius * 2) b.shape.y = -b.radius;
      var pulse = 1 + 0.06 * Math.sin(time + b.phase);
      b.shape.scaleX = b.shape.scaleY = b.baseScale * pulse;
      b.shape.rotation += b.rotSpeed;
      b.shape.alpha = 0.72 + 0.22 * Math.sin(time * 0.6 + b.phase);
    }

    // Sparkles — twinkle
    for (var s = 0; s < sparkleList.length; s++) {
      var sp = sparkleList[s];
      sp.shape.alpha = sp.baseAlpha * (0.4 + 0.6 * Math.abs(Math.sin(time * 2 + sp.phase)));
    }

    // Floating hearts — drift up + horizontal wobble, respawn at bottom
    for (var k = 0; k < heartShapes.length; k++) {
      var ht = heartShapes[k];
      ht.shape.y += ht.vy;
      ht.shape.x += ht.wobble * Math.sin(time + ht.phase);
      ht.shape.alpha = 0.55 + 0.35 * Math.sin(time * 0.8 + k * 0.5);
      if (ht.shape.y < -30) {
        ht.shape.y = h + 30;
        ht.shape.x = Math.random() * w;
      }
      if (ht.shape.x < -20) ht.shape.x = w + 20;
      if (ht.shape.x > w + 20) ht.shape.x = -20;
    }

    // Rings — slow float up, respawn at bottom
    for (var r = 0; r < ringShapes.length; r++) {
      var rn = ringShapes[r];
      rn.shape.y += rn.vy;
      rn.shape.alpha = 0.4 + 0.25 * Math.sin(time + rn.phase);
      if (rn.shape.y < -20) {
        rn.shape.y = h + 20;
        rn.shape.x = Math.random() * w;
      }
    }

    stage.update();
  }

  createjs.Ticker.framerate = 60;
  createjs.Ticker.addEventListener("tick", tick);

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    stage.scaleX = stage.scaleY = dpr;
    drawBg();
    // Reposition all elements so they cover the full new area
    for (var b = 0; b < bloomList.length; b++) {
      var bl = bloomList[b];
      bl.shape.x = Math.random() * (w + bl.radius) - bl.radius * 0.5;
      bl.shape.y = Math.random() * (h + bl.radius) - bl.radius * 0.5;
    }
    for (var i = 0; i < bokehList.length; i++) {
      var b = bokehList[i];
      b.shape.x = Math.random() * (w + b.radius * 2) - b.radius;
      b.shape.y = Math.random() * (h + b.radius * 2) - b.radius;
    }
    for (var s = 0; s < sparkleList.length; s++) {
      sparkleList[s].shape.x = Math.random() * w;
      sparkleList[s].shape.y = Math.random() * h;
    }
    for (var k = 0; k < heartShapes.length; k++) {
      heartShapes[k].shape.x = Math.random() * w;
      heartShapes[k].shape.y = Math.random() * h;
    }
    for (var r = 0; r < ringShapes.length; r++) {
      ringShapes[r].shape.x = Math.random() * w;
      ringShapes[r].shape.y = Math.random() * h;
    }
    stage.update();
  }

  window.addEventListener("resize", resize);
  window.addEventListener("load", resize);
  window.addEventListener("orientationchange", function() {
    setTimeout(resize, 150);
  });
})();
