(function () {
  var WA = "https://wa.me/5561992520281?text=" + encodeURIComponent("Olá, quero solicitar um orçamento");
  document.querySelectorAll(".wa-link").forEach(function (a) { a.href = WA; });
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var items = [
    { k: "flyer", t: "Canaã x Galáticos", sub: "Candangão Sub-17", src: "a01.jpg" },
    { k: "flyer", t: "Planaltina x Gama", sub: "Candangão Sub-20", src: "a02.jpg" },
    { k: "flyer", t: "Canaã x Coimbra", sub: "Amistoso", src: "a04.jpg" },
    { k: "flyer", t: "Canaã x Atlético GO", sub: "Supercopa Capital Sub-17", src: "a06.jpg" },
    { k: "flyer", t: "Canaã x Cruzeiro", sub: "Amistoso", src: "a07.jpg" },
    { k: "flyer", t: "Planaltina x Gama", sub: "Candangão Sub-20", src: "a03.jpg" },
    { k: "flyer", t: "Planaltina x Gama", sub: "Candangão Sub-20", src: "a08.jpg" },
    { k: "flyer", t: "Taguatinga x Gama", sub: "Candangão Sub-20", src: "a09.jpg" },
    { k: "flyer", t: "Canaã x Coritiba", sub: "Supercopa Capital Sub-17", src: "a10.jpg" },
    { k: "dvd", t: "Marcus Dantas", sub: "Capa de DVD", src: "a11.jpg" },
    { k: "dvd", t: "João Pedro", sub: "Perfil do atleta", src: "a05.jpg" }
  ];
  var kindName = { flyer: "Flyer", dvd: "DVD" };
  var counts = { flyer: 0, dvd: 0 };

  items.forEach(function (it, i) {
    var host = document.getElementById(it.k === "dvd" ? "gridDvd" : "gridFlyer");
    var n = counts[it.k]++;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "tile rv";
    b.dataset.i = i;
    b.style.setProperty("--rd", (n % 3) * 110 + "ms");
    b.style.setProperty("--rr", (n % 2 ? 2 : -2) + "deg");
    b.innerHTML = '<div class="frame"><img src="' + it.src + '" alt="' + it.t + ' - ' + it.sub + '" loading="lazy"></div><div class="meta"><b>' + it.t + '</b><span>' + it.sub + '</span></div>';
    host.appendChild(b);
  });

  var chips = document.querySelectorAll(".chip");
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      chips.forEach(function (x) { x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
      var f = c.dataset.f;
      document.querySelectorAll(".group").forEach(function (g) {
        g.classList.toggle("out", f !== "todos" && g.dataset.g !== f);
        g.querySelectorAll(".rv").forEach(function (t) { t.classList.add("in"); });
      });
    });
  });

  var lb = document.getElementById("lb");
  var last = null;
  function open(i) {
    var it = items[i];
    document.getElementById("lbPic").innerHTML = '<img src="' + it.src + '" alt="' + it.t + ' - ' + it.sub + '">';
    document.getElementById("lbTitle").textContent = it.t;
    document.getElementById("lbKind").textContent = kindName[it.k] + " · " + it.sub;
    lb.hidden = false;
    document.getElementById("lbClose").focus();
  }
  function close() { lb.hidden = true; if (last) last.focus(); }
  document.getElementById("portfolio").addEventListener("click", function (e) {
    var t = e.target.closest(".tile");
    if (!t) return;
    last = t;
    open(+t.dataset.i);
  });
  document.getElementById("lbClose").addEventListener("click", close);
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !lb.hidden) close(); });

  /* revelar ao rolar + contagem dos precos */
  var rvs = document.querySelectorAll(".rv");
  function countUp(el) {
    var to = +el.dataset.to, t0 = null;
    if (reduce) { el.textContent = to; return; }
    el.textContent = "0";
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / 1100, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && !reduce) {
    document.documentElement.classList.add("js");
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        en.target.querySelectorAll(".num").forEach(countUp);
        rio.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    rvs.forEach(function (el) { rio.observe(el); });
  }

  /* parallax do leque de artes (so mouse) */
  var fan = document.getElementById("fan");
  if (fan && !reduce && window.matchMedia("(pointer: fine)").matches) {
    var hero = document.getElementById("inicio");
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      fan.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      fan.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
    hero.addEventListener("pointerleave", function () { fan.style.setProperty("--px", 0); fan.style.setProperty("--py", 0); });
  }

  var links = document.querySelectorAll(".nav a.link");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle("on", l.getAttribute("href") === "#" + en.target.id); });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    ["portfolio", "valores", "sobre", "contato"].forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }
})();
