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

import { BaseHelpers } from "./helpers/base-helpers";
import { PopupManager } from "./modules/popup-manager";
import { BurgerMenu } from "./modules/burger-menu";
import { Tabs } from "./modules/tabs";
import { Accordion } from "./modules/accordion";

import Swiper from "swiper/bundle";

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

new Tabs("tabs-example", {
	onChange: (data) => {
		console.log(data);
	},
});

new Accordion(".accordion", {
	shouldOpenAll: false, // true
	defaultOpen: [], // [0,1]
	collapsedClass: "open",
});

const mobileButton = document.querySelector(".header__menu--button");
const menu = document.querySelector(".menu");

mobileButton.addEventListener("click", () => {
	if (mobileButton.classList.contains("active")) {
		mobileButton.classList.remove("active");
		menu.classList.remove("active");
		document.body.style.overflow = "auto";
	} else {
		mobileButton.classList.add("active");
		menu.classList.add("active");
		document.body.style.overflow = "hidden";
	}
});

const swiper = new Swiper(".swiper", {
	direction: "horizontal",
	loop: true,
	slidesPerView: "auto", // авто-подбор
	spaceBetween: 28,
	navigation: {
		nextEl: ".next-button",
		prevEl: ".prev-button",
	},
});

const bannerModal = document.querySelectorAll(".open-modal");
const mailForm = document.querySelector(".mail-form");
const mailFormClose = document.querySelector(".mail-form__close");

// Открытие модалки
bannerModal.forEach((button) => {
	button.addEventListener("click", () => {
		mailForm.classList.add("active");
		document.body.style.overflow = "hidden";
	});
});

// Закрытие по крестику
mailFormClose.addEventListener("click", closeModal);

// Закрытие по клику на оверлей
mailForm.addEventListener("click", (e) => {
	// Если клик произошел именно на самом .mail-form (на оверлее),
	// а не на его дочерних элементах (форме, заголовке и т.д.)
	if (e.target === mailForm) {
		closeModal();
	}
});

// Закрытие по Escape
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") {
		closeModal();
	}
});

// Функция закрытия
function closeModal() {
	mailForm.classList.remove("active");
	document.body.style.overflow = "auto";
}

document.addEventListener("DOMContentLoaded", function () {
	const form = document.getElementById("contactForm");
	const messageEl = document.getElementById("message");
	const submitBtn = document.getElementById("submitBtn");

	// Форматирование телефона
	const phoneInput = document.getElementById("phone");
	phoneInput.addEventListener("input", function (e) {
		let value = e.target.value.replace(/\D/g, "");

		if (value.length > 0) {
			if (value[0] === "8") {
				value = "7" + value.slice(1);
			}

			if (value.length > 0) value = "+" + value;
			if (value.length > 1) value = value.substring(0, 2) + " " + value.substring(2);
			if (value.length > 6) value = value.substring(0, 6) + " " + value.substring(6);
			if (value.length > 10) value = value.substring(0, 10) + "-" + value.substring(10);
			if (value.length > 13) value = value.substring(0, 13) + "-" + value.substring(13);

			e.target.value = value;
		}
	});

	// Обработка отправки формы
	form.addEventListener("submit", function (e) {
		e.preventDefault();

		// Проверка валидности формы
		if (!form.checkValidity()) {
			showMessage("Пожалуйста, заполните все поля корректно", "error");
			return;
		}

		// Показать загрузку
		showMessage("Отправка сообщения...", "loading");
		submitBtn.disabled = true;
		submitBtn.textContent = "Отправка...";

		// Собрать данные формы
		const formData = new FormData(this);

		// Отправить данные на сервер
		fetch("send-mail.php", {
			method: "POST",
			body: formData,
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Ошибка сети");
				}
				return response.json();
			})
			.then((data) => {
				if (data.success) {
					showMessage(data.message || "Сообщение успешно отправлено!", "success");
					form.reset();
				} else {
					showMessage(data.message || "Произошла ошибка при отправке", "error");
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				showMessage("Ошибка сети. Пожалуйста, попробуйте позже.", "error");
			})
			.finally(() => {
				// Восстановить кнопку
				setTimeout(() => {
					submitBtn.disabled = false;
					submitBtn.textContent = "Отправить сообщение";
				}, 2000);
			});
	});

	// Функция для показа сообщений
	function showMessage(text, type) {
		messageEl.textContent = text;
		messageEl.className = "message " + type;
		messageEl.style.display = "block";

		// Автоскрытие для success сообщений
		if (type === "success") {
			setTimeout(() => {
				messageEl.textContent = "";
			}, 5000);
		}
	}
});
