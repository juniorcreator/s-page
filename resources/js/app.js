
class Slider {
  constructor({slider, slidePrev, slideNext, ifSlideNav,
                offset, slideToShow, autoplay, timer, responsive}) {
    this.slider = document.querySelector(slider);
    this.sliderOverflow = this.slider.querySelector('.slider__overflow');
    this.slideItem = this.slider.querySelectorAll('.slider__item');
    this.slideNav = this.slider.querySelector('.slider__nav');
    this.slWrapper = this.slider.querySelector('.slider__wrapper');
    this.navPrev = this.slider.querySelector(slidePrev);
    this.navNext = this.slider.querySelector(slideNext);
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
  addClass(el, clas) {
    if( el.length > 1) el.forEach(el => el.classList.add(clas)); else { el.classList.add(clas);}
  }
  rmClass(el, clas) {
    if( el.length > 1) el.forEach(el => el.classList.remove(clas)); else { el.classList.remove(clas);}
  }
  toggleNavClass() {
    !this.count
        ? this.addClass(this.navPrev, 'not-allowed')
        : this.rmClass(this.navPrev, 'not-allowed');
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
    this.toggleNavClass();
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
        this.toggleNavClass();
      } else {
        this.resetToFirst();
        this.totalOffset = 0;
      }
    });
  }
  setPrev() {
      this.navPrev.addEventListener('click', () => {
        this.toggleNavClass();
        if (this.count) {
          let px = this.getStyle(this.slideItem[0], 'max-width') + this.offset;
          this.totalOffset = this.totalOffset - px;
          this.slWrapper.style.transform = `translate3d(-${this.totalOffset}px, 0px, 0px)`;
          this.slideItem[this.count -1].style.opacity = '1';
          this.slideItem[this.count + this.slideToShow -1].style.opacity = '0';
          this.count--;
          this.toggleNavClass();
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
      this.toggleNavClass()
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
    this.toggleNavClass();
    this.setNext();
    this.setPrev();
    this.setWrapWidth();
    this.doAutoplay();
    this.setResponcive();
    this.onresize();
  }
}
class ToggleEl {
  constructor (toggleEl, screen, prevDef, activeClass) {
    this.toggleEl =  document.querySelectorAll(toggleEl);
    this.screen = screen;
    this.prevDef = prevDef;
    this.activeClass = activeClass;
    this.toggle()
  }
  toggle() {
    this.toggleEl.forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth < this.screen) {
          if (this.prevDef) {
            e.preventDefault();
          }
          e.target.parentElement.classList.toggle(this.activeClass);
        }
      });
    });
  }
}
class Tabs {
  constructor (tabsBtn, tabContent, activeClass, dataset) {
    this.tabsBtn = document.querySelectorAll(tabsBtn);
    this.tabContent = document.querySelectorAll(tabContent);
    this.activeClass = activeClass;
    this.dataset = dataset;
    this.init();
  }
  init() {
    this.tabsBtn.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.tabContent.forEach((el, i) => {
          el.classList.remove(this.activeClass);
          this.tabsBtn[i].classList.remove(this.activeClass);
        });
        this.tabsBtn[+e.target.dataset[this.dataset]].classList.add(this.activeClass);
        this.tabContent[+e.target.dataset[this.dataset]].classList.add(this.activeClass);
      });
    });
  }
}
class ShowHide {
  constructor(elToClick, fClass, sClass, elToToggle, toggleClass, ifSmthOverflow, elToOverflow, clToOverflow) {
    this.elToClick = document.querySelector(elToClick);
    this.fClass = fClass;
    this.sClass = sClass;
    this.elToToggle = document.querySelector(elToToggle);
    this.toggleClass = toggleClass;
    this.ifSmthOverflow = ifSmthOverflow;
    this.elToOverflow = document.querySelector(elToOverflow);
    this.clToOverflow = clToOverflow;
    this.bool = false;
    this.init();
  }
  init() {
    this.elToClick.addEventListener('click', () => {
      this.bool = !this.bool;
      this.bool
          ? this.elToClick.classList.replace(this.fClass, this.sClass)
          :  this.elToClick.classList.replace(this.sClass, this.fClass);
      this.elToToggle.classList.toggle(this.toggleClass);
      if (this.ifSmthOverflow) {
        this.elToOverflow.classList.toggle(this.clToOverflow);
      }
    });
  }
}
class Pralax {
  constructor(element, speed) {
    this.element = document.querySelector(element);
    this.speed = speed;
    this.init();
  }
  init() {
    window.addEventListener("scroll", () => {
      let val = scrollY;
      let ofT = this.element.offsetTop;
      let res = val - ofT;
      this.element.style.backgroundPosition = '0% ' + (res / +this.element.dataset[this.speed]) + 'px';
    });
  }
}

class App {
  appInit() {
    let paralax = new Pralax('#paralax', 'speed');
    let showHide = new ShowHide('.nav__burger', 'fa-bars', 'fa-times', '.nav', 'show', true,  'body', 'overflow');
    let toggleEl = new ToggleEl('.js-with-nav', 768, true, 'active');
    let tabs = new Tabs('.tab-btn__item', '.tab-content__item', 'active', 'tab');
    let slide = new Slider({
      slider: '#slider',
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
  }
}
let app = new App().appInit();
