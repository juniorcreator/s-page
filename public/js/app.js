'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slider = function () {
  function Slider(_ref) {
    var slider = _ref.slider,
        speed = _ref.speed,
        slidePrev = _ref.slidePrev,
        slideNext = _ref.slideNext,
        ifSlideNav = _ref.ifSlideNav,
        offset = _ref.offset,
        slideToShow = _ref.slideToShow,
        autoplay = _ref.autoplay,
        timer = _ref.timer,
        responsive = _ref.responsive;

    _classCallCheck(this, Slider);

    this.slider = document.querySelector(slider);
    this.sliderOverflow = this.slider.querySelector('.slider__overflow');
    this.slideItem = this.slider.querySelectorAll('.slider__item');
    this.slideNav = this.slider.querySelector('.slider__nav');
    this.slWrapper = this.slider.querySelector('.slider__wrapper');
    this.speed = speed || 2000;
    this.navPrev = this.slider.querySelector(slidePrev);
    this.navNext = this.slider.querySelector(slideNext);
    this.indexes = 0;
    this.offset = offset || 30;
    this.slideToShow = slideToShow || 3;
    this.autoplay = autoplay || false;
    this.ifSlideNav = ifSlideNav || false;
    this.timer = timer || 2000;
    this.responsive = responsive;
    this.count = 0;
    this.totalOffset = 0;
    this.init();
  }

  _createClass(Slider, [{
    key: 'baseSetOnInit',
    value: function baseSetOnInit() {
      var _this = this;

      this.slider.style.position = 'relative';
      this.sliderOverflow.style.overflowX = 'hidden';
      this.slideItem.forEach(function (item, index) {
        item.style.marginRight = _this.offset + 'px';
        item.style.opacity = '0';
        if (index < _this.slideToShow) {
          item.style.opacity = '1';
        }
      });
      this.slWrapper.style.marginRight = -this.offset + 'px';
    }
  }, {
    key: 'showHideNav',
    value: function showHideNav() {
      if (this.ifSlideNav) {
        this.slideNav.style.display = 'block';
      } else {
        this.slideNav.style.display = 'none';
      }
    }
  }, {
    key: 'setSlideToShow',
    value: function setSlideToShow() {
      for (var i = 0; i < this.slideToShow; i++) {
        this.slideItem[i].style.opacity = '1';
      }
    }
  }, {
    key: 'doAutoplay',
    value: function doAutoplay() {
      var _this2 = this;

      if (this.autoplay) {
        setInterval(function () {
          _this2.navNext.click();
        }, this.timer);
      }
    }
  }, {
    key: 'resetToFirst',
    value: function resetToFirst() {
      this.slWrapper.style.transform = 'translate3d(-0px, 0px, 0px)';
      this.slideItem.forEach(function (el) {
        return el.style.opacity = '1';
      });
      this.count = 0;
      this.totalOffset = 0;
    }
  }, {
    key: 'getStyle',
    value: function getStyle(el, style) {
      var s = window.getComputedStyle(el);
      var st = parseInt(s.getPropertyValue(style));
      return parseInt(st);
    }
  }, {
    key: 'setWrapWidth',
    value: function setWrapWidth() {
      var _this3 = this;

      var tw = 0;
      this.slideItem.forEach(function (el) {
        tw += _this3.getStyle(el, 'max-width');
      });
      tw += this.offset * this.slideItem.length;
      this.slWrapper.style.width = tw + 'px';
    }
  }, {
    key: 'setNext',
    value: function setNext() {
      var _this4 = this;

      this.navNext.addEventListener('click', function () {
        var px = _this4.getStyle(_this4.slideItem[0], 'max-width') + _this4.offset;
        _this4.totalOffset += px;
        if (_this4.count < _this4.slideItem.length - _this4.slideToShow) {
          _this4.slideItem[_this4.count].style.opacity = '0';
          _this4.slideItem[_this4.count + _this4.slideToShow].style.opacity = '1';
          _this4.slWrapper.style.transform = 'translate3d(-' + _this4.totalOffset + 'px, 0px, 0px)';
          _this4.count++;
        } else {
          _this4.resetToFirst();
          _this4.totalOffset = 0;
        }
      });
    }
  }, {
    key: 'setPrev',
    value: function setPrev() {
      var _this5 = this;

      this.navPrev.addEventListener('click', function () {
        if (_this5.count) {
          var px = _this5.getStyle(_this5.slideItem[0], 'max-width') + _this5.offset;
          _this5.totalOffset = _this5.totalOffset - px;
          _this5.slWrapper.style.transform = 'translate3d(-' + _this5.totalOffset + 'px, 0px, 0px)';
          _this5.slideItem[_this5.count - 1].style.opacity = '1';
          _this5.count--;
        }
      });
    }
  }, {
    key: 'setResponcive',
    value: function setResponcive() {
      var _this6 = this;

      if (this.responsive) {
        (function () {
          var keys = [];
          var values = [];
          for (var key in _this6.responsive) {
            if (window.innerWidth < parseInt(key)) {
              Object.keys(_this6.responsive[key]).forEach(function (el) {
                keys.push(el);
              });
              Object.values(_this6.responsive[key]).forEach(function (el) {
                values.push(el);
              });
            }
          }
          keys.forEach(function (el, index) {
            _this6[el] = values[index];
          });
          _this6.resetToFirst();
          _this6.baseSetOnInit();
          _this6.setSlideToShow();
        })();
      }
    }
  }, {
    key: 'onresize',
    value: function onresize() {
      window.addEventListener('resize', this.setResponcive.bind(this));
    }
  }, {
    key: 'init',
    value: function init() {
      this.showHideNav();
      this.baseSetOnInit();
      this.setNext();
      this.setPrev();
      this.setWrapWidth();
      this.doAutoplay();
      this.setResponcive();
      this.onresize();
    }
  }]);

  return Slider;
}();

var App = function () {
  function App() {
    _classCallCheck(this, App);

    this.body = document.querySelector('body');
    this.nav = document.querySelector('.nav');
    this.navLink = document.querySelectorAll('.js-with-nav ');
    this.burger = document.querySelector('.nav__burger ');
    this.tabContents = document.querySelectorAll(".tab-content__item");
    this.tabBtns = document.querySelectorAll('.tab-btn__item');
    this.paralaxEl = document.getElementById('paralax');
  }

  _createClass(App, [{
    key: 'toggleNav',
    value: function toggleNav() {
      this.navLink.forEach(function (link) {
        link.addEventListener('click', function (e) {
          if (window.innerWidth < 768) {
            e.preventDefault();
            this.parentElement.classList.toggle('active');
          }
        });
      });
    }
  }, {
    key: 'showHideMenu',
    value: function showHideMenu() {
      var _this7 = this;

      this.burger.addEventListener('click', function () {
        _this7.nav.classList.toggle('show');
        _this7.body.classList.toggle('overflow');
      });
    }
  }, {
    key: 'tabs',
    value: function tabs() {
      var _this8 = this;

      this.tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          _this8.tabContents.forEach(function (el, i) {
            el.classList.remove('active');
            _this8.tabBtns[i].classList.remove('active');
          });
          _this8.tabBtns[+e.target.dataset.tab].classList.add('active');
          _this8.tabContents[+e.target.dataset.tab].classList.add('active');
        });
      });
    }
  }, {
    key: 'paralax',
    value: function paralax(el) {
      window.addEventListener("scroll", function () {
        var val = scrollY;
        var ofT = el.offsetTop;
        var res = val - ofT;
        el.style.backgroundPosition = '0% ' + res / +el.dataset.speed + 'px';
      });
    }
  }, {
    key: 'init',
    value: function init() {
      this.showHideMenu();
      this.toggleNav();
      this.tabs();
      this.paralax(this.paralaxEl);
    }
  }]);

  return App;
}();

var app = new App().init();

var slide = new Slider({
  slider: '#slider',
  speed: 300,
  slidePrev: '.slider__prev',
  slideNext: '.slider__next',
  ifSlideNav: true,
  offset: 120,
  slideToShow: 3,
  autoplay: false,
  timer: 2000,
  responsive: {
    '1590w': {
      offset: 120,
      slideToShow: 3
    },
    '1200w': {
      offset: 30,
      slideToShow: 3
    },
    '960w': {
      offset: 40,
      slideToShow: 3
    },
    '769w': {
      offset: 15,
      slideToShow: 3
    },
    '690w': {
      offset: 20,
      slideToShow: 2
    },
    '540w': {
      offset: 0,
      slideToShow: 1
    }
  }
});