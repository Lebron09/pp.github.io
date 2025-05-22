/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});
		

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});
		
		$(document).ready(function() {
		$('.service-header').on('click', function() {
			var $card = $(this).closest('.service-card');
			var $otherCards = $('.service-card').not($card);
			
			// Закрываем все другие карточки
			$otherCards.removeClass('active');
			
			// Переключаем текущую карточку
			$card.toggleClass('active');
		});
	});
	// Анимации для страницы преимуществ
		$(document).ready(function() {
			// Инициализация слайдера отзывов
			let currentTestimonial = 0;
			const testimonials = $('.testimonial');
			const dotsContainer = $('.slider-dots');
			
			// Создаем точки навигации
			testimonials.each(function(index) {
				dotsContainer.append(`<div class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`);
			});
			
			const dots = $('.dot');
			
			function showTestimonial(index) {
				testimonials.removeClass('active').eq(index).addClass('active');
				dots.removeClass('active').eq(index).addClass('active');
				currentTestimonial = index;
			}
			
			$('.next-testimonial').click(function() {
				let next = currentTestimonial + 1;
				if (next >= testimonials.length) next = 0;
				showTestimonial(next);
			});
			
			$('.prev-testimonial').click(function() {
				let prev = currentTestimonial - 1;
				if (prev < 0) prev = testimonials.length - 1;
				showTestimonial(prev);
			});
			
			dots.click(function() {
				showTestimonial(parseInt($(this).data('index')));
			});
			
			// Автопереключение отзывов
			setInterval(() => {
				let next = currentTestimonial + 1;
				if (next >= testimonials.length) next = 0;
				showTestimonial(next);
			}, 5000);
			
			// Инициализация анимаций при прокрутке
			function initAnimations() {
				$('[data-aos]').each(function() {
					const el = $(this);
					const offset = el.offset().top;
					const scrollTop = $(window).scrollTop();
					const windowHeight = $(window).height();
					
					if (scrollTop + windowHeight > offset + 100) {
						el.addClass('aos-animate');
					}
				});
			}
			
			$(window).scroll(initAnimations);
			initAnimations();
		});
	// Обработка интерактивной модели форсунки
document.querySelectorAll('.nozzle-part').forEach(part => {
    part.addEventListener('mouseenter', function() {
        const problem = this.getAttribute('data-problem');
        const infoBox = this.closest('.nozzle-model').querySelector('.nozzle-problem-info');
        infoBox.textContent = problem;
        infoBox.style.display = 'block';
    });
    
    part.addEventListener('mouseleave', function() {
        const infoBox = this.closest('.nozzle-model').querySelector('.nozzle-problem-info');
        infoBox.style.display = 'none';
    });
});

// Обработка слайдера пробега
const mileageSlider = document.getElementById('mileageSlider');
if (mileageSlider) {
    mileageSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach(item => {
            item.classList.remove('active');
        });
        
        if (value < 50) {
            timelineItems[0].classList.add('active');
        } else if (value < 100) {
            timelineItems[1].classList.add('active');
        } else if (value < 150) {
            timelineItems[2].classList.add('active');
        } else {
            timelineItems[3].classList.add('active');
        }
    });
}

// Обработка диагностической кнопки
const diagnoseButton = document.querySelector('.diagnose-button');
if (diagnoseButton) {
    diagnoseButton.addEventListener('click', function() {
        const checkedSymptoms = document.querySelectorAll('.symptom-item input[type="checkbox"]:checked');
        const resultBox = document.querySelector('.diagnosis-result');
        
        if (checkedSymptoms.length === 0) {
            resultBox.textContent = "Пожалуйста, отметьте хотя бы один симптом";
            resultBox.style.color = "#ff5e5e";
        } else if (checkedSymptoms.length >= 3) {
            resultBox.innerHTML = "<strong>Рекомендуем срочную диагностику!</strong> Ваши симптомы указывают на возможные серьезные проблемы с форсунками.";
            resultBox.style.color = "#ff5e5e";
        } else {
            resultBox.innerHTML = "<strong>Рекомендуем проверить форсунки.</strong> Некоторые симптомы могут указывать на начинающиеся проблемы.";
            resultBox.style.color = "#4facfe";
        }
        
        resultBox.style.display = "block";
    });
}
// Обновление индикатора рабочих часов
function updateWorkingHours() {
    const now = new Date();
    const day = now.getDay(); // 0-6 (0 - воскресенье)
    const hour = now.getHours();
    const progress = document.querySelector('.hours-progress');
    
    if (day >= 1 && day <= 5) { // Пн-Пт
        const open = 9, close = 18;
        const total = close - open;
        const current = hour - open;
        const percent = Math.min(100, Math.max(0, (current / total) * 100));
        progress.style.width = percent + '%';
    } else if (day === 6) { // Сб
        const open = 10, close = 15;
        const total = close - open;
        const current = hour - open;
        const percent = Math.min(100, Math.max(0, (current / total) * 100));
        progress.style.width = percent + '%';
    } else { // Вс
        progress.style.width = '0%';
    }
}

// Запуск при загрузке и обновление каждую минуту
updateWorkingHours();
setInterval(updateWorkingHours, 60000);
})(jQuery);

