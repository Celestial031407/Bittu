(function() {
  // Touch/click: add .touched for same cute effect as hover (for mobile)
  var overlay = document.querySelector(".text-overlay");
  if (!overlay) return;

  var els = overlay.querySelectorAll(".title, .sub, .propose, .day, .quote");

  function addTouched(e) {
    var t = e.currentTarget;
    t.classList.add("touched");
    clearTimeout(t._touchedTimer);
    t._touchedTimer = setTimeout(function() {
      t.classList.remove("touched");
    }, 600);
  }

  for (var i = 0; i < els.length; i++) {
    els[i].addEventListener("click", addTouched);
    els[i].addEventListener("touchend", function(ev) {
      ev.preventDefault();
      addTouched(ev);
    }, { passive: false });
  }
})();
