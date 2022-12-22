var ImageLazyLoad = function () {
  this.init();
};
let a = 1;
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
    if (!(context || document).querySelectorAll("[data-lazyLoad]").length) {
      this.removeEvent();
    } else if (!this.scrollEvent) {
      this.addEvent();
    }
  },
  addEvent: function () {
    this.scrollEvent = this.debounceOrThrottle.bind(this);
    window.addEventListener("scroll", this.scrollEvent, false);
    window.addEventListener("load", this.scrollEvent, false);
  },
  removeEvent: function () {
    window.removeEventListener("scroll", this.scrollEvent);
    clearTimeout(this.poll);
    this.scrollEvent = null;
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
module.exports = ImageLazyLoad;
