(function() {
  var btnYes = document.querySelector(".btn-yes");
  var btnNo = document.getElementById("btn-no");
  var successOverlay = document.getElementById("success-overlay");

  if (!btnYes || !btnNo || !successOverlay) return;

  function runAwayNo() {
    var noRect = btnNo.getBoundingClientRect();
    if (!btnNo.classList.contains("running-away")) {
      btnNo.classList.add("running-away");
      btnNo.style.left = (noRect.left + noRect.width / 2) + "px";
      btnNo.style.top = (noRect.top + noRect.height / 2) + "px";
      btnNo.style.transform = "translate(-50%, -50%)";
    }
    var w = window.innerWidth;
    var h = window.innerHeight;
    // Responsive frame: fits any screen
    var frameWidth = Math.min(280, w * 0.88);
    var frameHeight = Math.min(140, h * 0.22);
    var frameLeft = (w - frameWidth) / 2;
    var frameTop = (h - frameHeight) / 2;
    var padding = 8;
    var maxX = Math.max(0, frameWidth - noRect.width - padding * 2);
    var maxY = Math.max(0, frameHeight - noRect.height - padding * 2);
    var left = frameLeft + padding + Math.random() * maxX;
    var top = frameTop + padding + Math.random() * maxY;
    btnNo.style.left = (left + noRect.width / 2) + "px";
    btnNo.style.top = (top + noRect.height / 2) + "px";
    btnNo.style.transform = "translate(-50%, -50%)";
  }

  function showHowDareYou() {
    var msg = document.createElement("div");
    msg.className = "how-dare-msg";
    msg.textContent = "How dare u";
    document.body.appendChild(msg);
    setTimeout(function() {
      msg.classList.add("how-dare-fade");
      setTimeout(function() {
        if (msg.parentNode) msg.parentNode.removeChild(msg);
      }, 400);
    }, 2200);
  }

  btnNo.addEventListener("touchstart", function(e) {
    runAwayNo();
    showHowDareYou();
    e.preventDefault();
  }, { passive: false });
  btnNo.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    runAwayNo();
    showHowDareYou();
  });

  // Yes: show success
  btnYes.addEventListener("click", function() {
    successOverlay.classList.add("visible");
  });
  btnYes.addEventListener("touchend", function(e) {
    e.preventDefault();
    successOverlay.classList.add("visible");
  }, { passive: false });

  // Click anywhere on success screen to go back / reload
  successOverlay.addEventListener("click", function() {
    location.reload();
  });
  successOverlay.addEventListener("touchend", function(e) {
    e.preventDefault();
    location.reload();
  }, { passive: false });
})();
