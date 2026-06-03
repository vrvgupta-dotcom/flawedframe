/* Flawed Frame — shared mobile navigation behaviour.
   Injects a hamburger toggle + full-screen menu built from each page's
   existing .nav-links. Idempotent; observes the DOM so it also wires up
   React-rendered navs (home, archive) that mount after this script runs. */
(function () {
  "use strict";

  var CONTACT = "mailto:collect@flawedframe.com";

  function buildMenu(nav) {
    if (!nav || nav.__mmInit) return;
    var inner = nav.querySelector(".nav-inner");
    var linksWrap = nav.querySelector(".nav-links");
    if (!inner || !linksWrap) return;
    nav.__mmInit = true;

    // --- toggle button ---
    var toggle = document.createElement("button");
    toggle.className = "nav-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Open menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = "<span></span><span></span><span></span>";
    var right = nav.querySelector(".nav-right");
    (right || inner).appendChild(toggle);

    // --- menu overlay ---
    var menu = document.createElement("div");
    menu.className = "m-menu";
    menu.setAttribute("role", "dialog");
    menu.setAttribute("aria-modal", "true");
    menu.setAttribute("aria-label", "Menu");
    menu.hidden = false;

    var eyebrow = document.createElement("div");
    eyebrow.className = "m-menu-eyebrow";
    eyebrow.textContent = "Flawed Frame";
    menu.appendChild(eyebrow);

    var list = document.createElement("nav");
    list.className = "m-menu-list";

    var anchors = linksWrap.querySelectorAll("a");
    anchors.forEach(function (a, i) {
      var item = document.createElement("a");
      item.href = a.getAttribute("href");
      var label = (a.textContent || "").trim();
      var text = document.createElement("span");
      text.textContent = label;
      var idx = document.createElement("span");
      idx.className = "idx";
      idx.textContent = "0" + (i + 1);
      item.appendChild(text);
      item.appendChild(idx);
      if (a.classList.contains("nav-signin")) item.className = "m-signin";
      list.appendChild(item);
    });

    // include the account avatar as an explicit entry when it links somewhere
    var avatar = nav.querySelector("a.nav-avatar[href]");
    if (avatar) {
      var acct = document.createElement("a");
      acct.href = avatar.getAttribute("href");
      var at = document.createElement("span");
      at.textContent = "Account";
      var ai = document.createElement("span");
      ai.className = "idx";
      ai.textContent = "0" + (anchors.length + 1);
      acct.appendChild(at);
      acct.appendChild(ai);
      list.appendChild(acct);
    }

    menu.appendChild(list);

    var foot = document.createElement("div");
    foot.className = "m-menu-foot";
    foot.innerHTML = 'Questions — <a href="' + CONTACT + '">collect@flawedframe.com</a>';
    menu.appendChild(foot);

    document.body.appendChild(menu);

    // --- behaviour ---
    function setOpen(open) {
      toggle.classList.toggle("is-open", open);
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.documentElement.style.overflow = open ? "hidden" : "";
    }
    function isOpen() { return menu.classList.contains("is-open"); }

    toggle.addEventListener("click", function () { setOpen(!isOpen()); });
    list.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) setOpen(false);
    });
    // close if the viewport grows past the mobile breakpoint
    if (window.matchMedia) {
      var mq = window.matchMedia("(min-width: 641px)");
      var onChange = function (ev) { if (ev.matches && isOpen()) setOpen(false); };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  function scan() {
    document.querySelectorAll("nav.nav").forEach(buildMenu);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan);
  } else {
    scan();
  }

  // React navs (home, archive) mount after this runs — observe for them.
  var tries = 0;
  var obs = new MutationObserver(function () {
    scan();
    if (++tries > 40) obs.disconnect();
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
  // safety: stop observing after 8s regardless
  setTimeout(function () { obs.disconnect(); }, 8000);
})();
