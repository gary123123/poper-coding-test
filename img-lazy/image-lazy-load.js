var ImageLazyLoad = function () {
  this.init();
};
ImageLazyLoad.prototype = {
  init: function (opts) {
    opts = opts || {};
    var offsetAll = opts.offset || 0;
    var offsetVertical = opts.offsetVertical || offsetAll;
    var offsetHorizontal = opts.offsetHorizontal || offsetAll;
    var optionToInt = function (opt, fallback) {
      return parseInt(opt || fallback, 10);
    };
    this.offset = {
      t: optionToInt(opts.offsetTop, offsetVertical),
      b: optionToInt(opts.offsetBottom, offsetVertical),
      l: optionToInt(opts.offsetLeft, offsetHorizontal),
      r: optionToInt(opts.offsetRight, offsetHorizontal),
    };
    this.delay = opts.throttle || 250;
    this.render();
    window.addEventListener(
      "scroll",
      this.debounceOrThrottle.bind(this),
      false
    );
    window.addEventListener("load", this.debounceOrThrottle.bind(this), false);
  },
  render: function (context) {
    var nodes = (context || document).querySelectorAll("[data-lazyLoad]");
    var length = nodes.length;
    var src, elem;
    var view = {
      l: 0 - this.offset.l,
      t: 0 - this.offset.t,
      b:
        (window.innerHeight || document.documentElement.clientHeight) +
        this.offset.b,
      r:
        (window.innerWidth || document.documentElement.clientWidth) +
        this.offset.r,
    };
    for (var i = 0; i < length; i++) {
      elem = nodes[i];
      if (this.inView(elem, view)) {
        if (elem.src !== (src = elem.getAttribute("data-lazyLoad"))) {
          elem.src = src;
        }

        elem.removeAttribute("data-lazyLoad");
      }
    }
    // if (!length) {
    //   this.removeEvent();
    // }
  },
  removeEvent: function () {
    window.removeEventListener("scroll", this.debounceOrThrottle);
    clearTimeout(this.poll);
  },
  inView: function (element, view) {
    if (this.isHidden(element)) {
      return false;
    }

    var box = element.getBoundingClientRect();
    return (
      box.right >= view.l &&
      box.bottom >= view.t &&
      box.left <= view.r &&
      box.top <= view.b
    );
  },
  isHidden: function (element) {
    return element.offsetParent === null;
  },
  debounceOrThrottle: function () {
    if (!!this.poll) {
      return;
    }
    clearTimeout(this.poll);
    var _this = this;
    this.poll = setTimeout(function () {
      _this.render();
      _this.poll = null;
    }, this.delay);
  },
};
