
class Slider {
  constructor({slider, speed, slidePrev, slideNext, ifSlideNav,
                offset, slideToShow, autoplay, timer, responsive}) {
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
  baseSetOnInit() {
    this.slider.style.position = 'relative';
    this.sliderOverflow.style.overflowX = 'hidden';
    this.slideItem.forEach((item, index) => {
      item.style.marginRight = this.offset + 'px';
      item.style.opacity = '0';
      if (index < this.slideToShow) {
        item.style.opacity = '1';
      }
    });
    this.slWrapper.style.marginRight = -this.offset + 'px';
  }
  showHideNav() {
    if (this.ifSlideNav) {
      this.slideNav.style.display = 'block'
    } else {
      this.slideNav.style.display = 'none';
    }
  }
  setSlideToShow() {
    for (let i = 0; i < this.slideToShow; i++) {
      this.slideItem[i].style.opacity = '1';
    }
  }
  doAutoplay() {
    if (this.autoplay) {
      setInterval(() => {this.navNext.click()}, this.timer);
    }
  }
  resetToFirst() {
    this.slWrapper.style.transform = `translate3d(-0px, 0px, 0px)`;
    this.slideItem.forEach(el => el.style.opacity = '1');
    this.count = 0;
    this.totalOffset = 0;
  }
  getStyle(el, style) {
    let s = window.getComputedStyle(el);
    let st = parseInt(s.getPropertyValue(style));
    return  parseInt(st);
  }
  setWrapWidth() {
    let tw = 0;
    this.slideItem.forEach(el => {tw += this.getStyle(el, 'max-width');});
    tw += this.offset * this.slideItem.length;
    this.slWrapper.style.width = tw + 'px';
  }
  setNext() {
    this.navNext.addEventListener('click', () => {
      let px = this.getStyle(this.slideItem[0], 'max-width') + this.offset;
      this.totalOffset += px;
      if (this.count < (this.slideItem.length  - this.slideToShow)) {
        this.slideItem[this.count].style.opacity = '0';
        this.slideItem[this.count + this.slideToShow].style.opacity = '1';
        this.slWrapper.style.transform = `translate3d(-${this.totalOffset}px, 0px, 0px)`;
        this.count++;
      } else {
        this.resetToFirst();
        this.totalOffset = 0;
      }
    });
  }
  setPrev() {
      this.navPrev.addEventListener('click', () => {
        if (this.count) {
          let px = this.getStyle(this.slideItem[0], 'max-width') + this.offset;
          this.totalOffset = this.totalOffset - px;
          this.slWrapper.style.transform = `translate3d(-${this.totalOffset}px, 0px, 0px)`;
          this.slideItem[this.count -1].style.opacity = '1';
          this.count--;
        }
      });
  }
  setResponcive() {
    if (this.responsive) {
      let keys = [];
      let values = [];
      for (let key in this.responsive) {
        if (window.innerWidth < parseInt(key)) {
          Object.keys(this.responsive[key]).forEach(el => {keys.push(el);});
          Object.values(this.responsive[key]).forEach(el => {values.push(el);});
        }
      }
      keys.forEach((el, index) => {
        this[el] = values[index];
      });
      this.resetToFirst();
      this.baseSetOnInit();
      this.setSlideToShow();
    }
  }
  onresize() {
    window.addEventListener('resize', this.setResponcive.bind(this));
  }
  init() {
    this.showHideNav();
    this.baseSetOnInit();
    this.setNext();
    this.setPrev();
    this.setWrapWidth();
    this.doAutoplay();
    this.setResponcive();
    this.onresize();
  }
}

class App {
  constructor() {
    this.body = document.querySelector('body');
    this.nav = document.querySelector('.nav');
    this.navLink = document.querySelectorAll('.js-with-nav ');
    this.burger = document.querySelector('.nav__burger ');
    this.tabContents = document.querySelectorAll(".tab-content__item");
    this.tabBtns = document.querySelectorAll('.tab-btn__item');
    this.paralaxEl = document.getElementById('paralax')
  }
  toggleNav() {
    this.navLink.forEach(link => {
      link.addEventListener('click', function (e) {
        if (window.innerWidth < 768) {
          e.preventDefault();
          this.parentElement.classList.toggle('active');
        }
      });
    });
  }
  showHideMenu() {
    this.burger.addEventListener('click', () => {
      this.nav.classList.toggle('show');
      this.body.classList.toggle('overflow');
    })
  }
  tabs() {
    this.tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.tabContents.forEach((el, i) => {
          el.classList.remove('active');
          this.tabBtns[i].classList.remove('active');
        });
        this.tabBtns[+e.target.dataset.tab].classList.add('active');
        this.tabContents[+e.target.dataset.tab].classList.add('active');
      });
    });
  }
  paralax(el) {
    window.addEventListener("scroll", () => {
      let val = scrollY;
      let ofT = el.offsetTop;
      let res = val - ofT;
      el.style.backgroundPosition = '0% ' + (res / +el.dataset.speed) + 'px';
    });
  }
  init() {
    this.showHideMenu();
    this.toggleNav();
    this.tabs();
    this.paralax(this.paralaxEl);
  }
}

let app = new App().init();

let slide = new Slider({
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


