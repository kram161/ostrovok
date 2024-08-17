/**
 * !(i)
 * Код попадает в итоговый файл, только когда вызвана функция, например FLSFunctions.spollers();
 * Или когда импортирован весь файл, например import "files/script.js";
 * Неиспользуемый код в итоговый файл не попадает.

 * Если мы хотим добавить модуль следует его раскомментировать
 */
// import { MousePRLX } from './libs/parallaxMouse'
// import AOS from 'aos'
// import Swiper, { Navigation, Pagination } from 'swiper';

import { BaseHelpers } from './helpers/base-helpers';
import { PopupManager } from './modules/popup-manager';
import { BurgerMenu } from './modules/burger-menu';
import { Tabs } from './modules/tabs';
import { Accordion } from './modules/accordion';

BaseHelpers.checkWebpSupport();

BaseHelpers.calcScrollbarWidth();

BaseHelpers.addTouchClass();

BaseHelpers.addLoadedClass();

BaseHelpers.headerFixed();

/**
 * Открытие/закрытие модальных окон
 * Чтобы модальное окно открывалось и закрывалось
 * На окно повешай атрибут data-popup="<название окна>"
 * На кнопку, которая вызывает окно повешай атрибут data-type="<название окна>"

 * На обертку(.popup) окна добавь атрибут '[data-close-overlay]'
 * На кнопку для закрытия окна добавь класс '.button-close'
 * */
new PopupManager();

/**
 *  Модуль для работы с меню (Бургер)
 * */
new BurgerMenu().init();

/**
 *  Библиотека для анимаций
 *  документация: https://michalsnik.github.io/aos
 * */
// AOS.init();

/**
 * Параллакс мышей
 * */
// new MousePRLX();

new Tabs('tabs-example', {
	onChange: (data) => {
		console.log(data);
	},
});

new Accordion('.accordion', {
	shouldOpenAll: false, // true
	defaultOpen: [], // [0,1]
	collapsedClass: 'open',
});


import Swiper from '../static/swiper/swiper-bundle.min.mjs'

const preHeader = new Swiper('.pre-header__swiper', {
	// Optional parameters
	direction: 'horizontal',
	loop: true,
	// Navigation arrows
	navigation: {
		nextEl: '.pre-header__next',
		prevEl: '.pre-header__prev',
	},

});

const presentationFirst = new Swiper('.first-slider', {
	// Optional parameters
	direction: 'horizontal',
	loop: true,
	// Navigation arrows
	navigation: {
		nextEl: '.first-slider__next',
		prevEl: '.first-slider__prev',
	},
	breakpoints: {
		// when window width is >= 320px
		320: {
			slidesPerView: 1,
			spaceBetween: 20
		},
		// when window width is >= 480px
		480: {
			slidesPerView: 2,
			spaceBetween: 30
		},
		// when window width is >= 640px
		1024: {
			slidesPerView: 3,
			spaceBetween: 40
		}
	}

});

const presentationSecond = new Swiper('.second-slider', {
	// Optional parameters
	direction: 'horizontal',
	loop: true,
	// Navigation arrows
	navigation: {
		nextEl: '.second-slider__next',
		prevEl: '.second-slider__prev',
	},
	breakpoints: {
		// when window width is >= 320px
		320: {
			slidesPerView: 1,
			spaceBetween: 20
		},
		// when window width is >= 480px
		480: {
			slidesPerView: 2,
			spaceBetween: 30
		},
		// when window width is >= 640px
		1024: {
			slidesPerView: 3,
			spaceBetween: 40
		}
	}

});

const contact = new Swiper('.contacts__slider', {
	direction: 'horizontal',
	loop: true,
	slidesPerView: 1,
	autoplay: {
		delay: 4000,
	},
});
