/*
Theme Name: Malat
Description: Responsive Personal / Portfolio / Resume Template
Author: Erilisdesign
Theme URI: https://preview.erilisdesign.com/html/malat/
Author URI: https://themeforest.net/user/erilisdesign
Version: 1.3.0
License: https://themeforest.net/licenses/standard
*/

/*------------------------------------------------------
[Table of contents]

1. Preloader
2. Navigation
3. Back to top
4. Page Cover
5. Backgrounds
6. Masonry
7. Lightbox
8. Slider
9. Mailchimp
10. Contact Form
11. Plugins
-------------------------------------------------------*/

(function($) {
	"use strict";

	// Vars
	var $body = $('body'),
		$preloader = $('#preloader'),
		preloaderDelay = 1200,
		preloaderFadeOutTime = 500,
		$navToggle = $('#navigation-toggle'),
		navSpyScroll = true,
		smoothScrollRun = false;

	function getWindowWidth() {
		return Math.max( $(window).width(), window.innerWidth);
	}

	function getWindowHeight(){
		return Math.max($(window).height(), window.innerHeight );
	}

	// [1. Preloader]
	function malat_preloader() {
		$preloader.delay(preloaderDelay).fadeOut(preloaderFadeOutTime);
	}

	// [2. Navigation]
	function getDuration(position) {
		var currentTop = $(window).scrollTop(),
			rate = 0.5, // 1000px/500ms distance;
			distance = Math.abs(currentTop - position);

		return distance * rate;
	}

	function getSectionsOffsets(){
		var _sectionNodeList = document.querySelectorAll('section'),
			i = 0,
			sections = [],
			homeHeight = document.querySelector('#home') ? document.querySelector('#home').offsetHeight : 0,
			el;

		while ( el = _sectionNodeList[ i++ ] ){
			if( el.hasAttribute('id') ){
				var _id = el.id;

				if( _id === 'home' ){
					sections.push({
						id: _id,
						offsetTop: el.offsetTop
					});
				} else {
					sections.push({
						id: _id,
						offsetTop: el.offsetTop + homeHeight
					});
				}
			}
		}

		return sections;
	}

	function malat_spyscroll(){
		if( navSpyScroll === false ){
			return false;
		}

		var sections = getSectionsOffsets(),
			lastScrollPosition,
			i = 0;

		window.addEventListener( 'scroll', function(){
			if( smoothScrollRun === true ){
				return false;
			}

			var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop,
				scrollPosition_b = document.documentElement.scrollTop || document.body.scrollTop;

			if( scrollPosition > lastScrollPosition ){
				scrollPosition = scrollPosition + getWindowHeight();
			} else if( scrollPosition < lastScrollPosition ){
				scrollPosition = scrollPosition_b;
			}

			for (i in sections){
				if ( scrollPosition >= sections[i].offsetTop ){
					if( $('#navigation a[href="#' + sections[i].id + '"]').length ){
						$('#navigation .active').removeClass('active');
						$('#navigation a[href="#' + sections[i].id + '"]').addClass('active');
					}
				}
			}

			lastScrollPosition = scrollPosition_b;
		});
	}

	function malat_navigation() {

		var class_open = 'site-header-open';

		$body.on( 'click', '#navigation-toggle', function(e) {
			e.preventDefault();
			if( !$(this).hasClass('open') ){
				$(this).addClass('open');
				$body.addClass(class_open);
			} else {
				$(this).removeClass('open');
				$body.removeClass(class_open);
			}
		});

		$body.on( 'click', '.header-overlay', function() {
			if ( $body.hasClass(class_open) && $navToggle.hasClass('open') ){
				$navToggle.trigger('click');
			}
		});

		$(document).keyup(function(e) {
			if ( e.keyCode == 27 && $body.hasClass(class_open) ) {
				$navToggle.trigger('click');
			}
		});

		// Back to top
		if ( $('#backtotop').length > 0 ) {
			$('body').on('click', '#backtotop', function(e) {
				e.preventDefault();

				var duration = getDuration(0);

				$('html, body').animate({
					scrollTop: 0
				}, duration, 'easeOutQuad' );

				return false;
			});
		}

		// Smooth Scroll
		$('body').on( 'click', 'a.scrollto', function(e) {
			if (this.hash !== '') {
				if( $( this.hash ).length > 0 ) {
					e.preventDefault();

					smoothScrollRun = true;

					var hash = this.hash,
						position = $(hash).offset().top,
						duration = getDuration(position);

					if ( $('.page-cover ' + hash).length ){
						position = $(hash).offset().top - $(window).scrollTop();
						duration = getDuration( position );
					}

					if( $('#navigation a[href="' + hash + '"]').length ){
						$('#navigation .active').removeClass('active');
						$('#navigation a[href="' + hash + '"]').addClass('active');
					}

					$('html, body').stop().animate({
						scrollTop: position
					}, duration, 'easeOutQuad', function() {
						window.location.hash = hash;
						smoothScrollRun = false;
					});

					if ( $navToggle.hasClass('open') ){
						$navToggle.trigger('click');
					}
				}
			}
		});

	}

	function malat_responsiveNavigation() {
		var class_open = 'site-header-open';

		if( getWindowWidth() >= 1200 ){
			$navToggle.removeClass('open');
			$body.removeClass(class_open);
		}
	}

	function malat_autoHideMobileNavigation() {
		if( $body.hasClass('auto-hide-mobile-nav') ){
			if( 1200 > getWindowWidth() ){
				var lastPos = 0,
					scrollDistance = 0,
					scrollDirection = 0,
					scrollDirection_UP = 8,
					scrollDirection_DOWN = 16,
					scrollDistance_A = 0,
					scrollDistance_count = 0;

				$(window).on('scroll', function(e){
					var currentPos = $(window).scrollTop();
					scrollDistance_count++;

					if (currentPos > lastPos){
						scrollDirection = scrollDirection_DOWN;
						
						if( scrollDistance_count === 1 ){
							scrollDistance_A = currentPos;
						}

						scrollDistance = currentPos - scrollDistance_A;
					} else {
						scrollDirection = scrollDirection_UP;
						scrollDistance_count = 0;
					}

					if( scrollDistance > 300 & scrollDirection === scrollDirection_DOWN ){
						$body.addClass('mobile-nav-hide');
					} else {
						$body.removeClass('mobile-nav-hide');
					}

					lastPos = currentPos;
				});
			} else {
				$body.removeClass('mobile-nav-hide');
			}
		}
	}

	// [3. Back to top]
	function malat_backToTop() {
		var $backtotop = $('#backtotop'),
			scrollPosition = $(window).scrollTop();

		if( getWindowWidth() >= 576 ){
			if ( scrollPosition > 200 ) {
				$backtotop.addClass('show');
			} else {
				$backtotop.removeClass('show');
			}
		} else {
			$backtotop.removeClass('show');
		}
	}

	// [4. Page cover]
	function malat_pageCover() {
		var pageCover = $('#page-cover');

		if( pageCover.length > 0 ){
			var pageCover_height = Math.max( $('#page-cover .page-cover-wrap').height(), $('#page-cover .page-cover-wrap').innerHeight() ),
				pageCover_offset = pageCover.offset().top,
				pageCover_content = $('#page-cover section .container'),
				last_scroll = 0,
				scroll_direction = 'down';

			pageCover.css( 'height', pageCover_height );

			$(window).on( 'scroll', function(){
				var scrollPos = $(window).scrollTop(),
					scrollStep = last_scroll - scrollPos;

				if ( pageCover_height > scrollPos ) {
					var opacity_value = (100 - (100 * scrollPos / pageCover_height )) / 100;

					pageCover_content.css( 'opacity', opacity_value );

					scroll_direction = ( last_scroll < scrollPos ) ? 'up' : 'down';
					last_scroll = scrollPos;
				}
			});
		}
	}

	// [5. Backgrounds]
	function malat_backgrounds() {

		// Image
		var $bgImage = $('.bg-image-holder');
		if( $bgImage.length ) {
			$bgImage.each(function(){
				var src = $(this).children('img').attr('src');
				var $self = $(this);

				$self.css('background-image','url('+src+')').children('img').hide();
			});
		}

		// Slideshow
		if ( $body.hasClass('slideshow-background') ) {
			$body.vegas({
				preload: true,
				timer: false,
				delay: 5000,
				transition: 'fade',
				transitionDuration: 1000,
				slides: [
					{ src: 'demo/images/image-15.jpg' },
					{ src: 'demo/images/image-16.jpg' },
					{ src: 'demo/images/image-10.jpg' },
					{ src: 'demo/images/image-14.jpg' }
				]
			});
		}

		// Slideshow - ZoomOut
		if ( $body.hasClass('slideshow-zoom-background') ) {
			$body.vegas({
				preload: true,
				timer: false,
				delay: 7000,
				transition: 'zoomOut',
				transitionDuration: 4000,
				slides: [
					{ src: 'demo/images/image-7.jpg' },
					{ src: 'demo/images/image-16.jpg' },
					{ src: 'demo/images/image-17.jpg' },
					{ src: 'demo/images/image-15.jpg' }
				]
			});
		}

		// Kenburns
		if ( $body.hasClass('kenburns-background') ) {

			var kenburnsDisplayBackdrops = false;
			var kenburnsBackgrounds = [
				{ src: 'demo/images/image-1.jpg', valign: 'center' },
				{ src: 'demo/images/image-14.jpg', valign: 'top' },
				{ src: 'demo/images/image-17.jpg', valign: 'center' }
			];

			$body.vegas({
				preload: true,
				transition: 'swirlLeft2',
				transitionDuration: 4000,
				timer: false,
				delay: 10000,
				slides: kenburnsBackgrounds,
				walk: function (nb) {
					if (kenburnsDisplayBackdrops === true) {
						var backdrop;

						backdrop = backdrops[nb];
						backdrop.animation = 'kenburns';
						backdrop.animationDuration = 20000;
						backdrop.transition = 'fade';
						backdrop.transitionDuration = 1000;

						$body
							.vegas('options', 'slides', [ backdrop ])
							.vegas('next');
					}
				}
			});
		}

		// Video Background
		if( $body.hasClass('mobile') ) {
			$('.video-wrapper').css('display', 'none');
		}

		// Granim
		$('[data-gradient-bg]').each(function(index,element){
			var granimParent = $(this),
				granimID = 'granim-'+index+'',
				colours = granimParent.attr('data-gradient-bg'),
				colours = colours.replace(' ',''),
				colours = colours.replace(/'/g, '"')
				colours = JSON.parse( colours );

			// Add canvas
			granimParent.prepend('<canvas id="'+granimID+'"></canvas>');

			var granimInstance = new Granim({
				element: '#'+granimID,
				name: 'basic-gradient',
				direction: 'left-right', // 'diagonal', 'top-bottom', 'radial'
				opacity: [1, 1],
				isPausedWhenNotInView: true,
				states : {
					"default-state": {
						gradients: colours
					}
				}
			});
		});

	}

	// [6. Masonry]
	function malat_masonryLayout() {
		if ($('.isotope-container').length > 0) {
			var $isotopeContainer = $('.isotope-container');
			var $columnWidth = $isotopeContainer.data('column-width');

			if($columnWidth == null){
				var $columnWidth = '.isotope-item';
			}

			$isotopeContainer.isotope({
				filter: '*',
				animationEngine: 'best-available',
				resizable: false,
				itemSelector : '.isotope-item',
				masonry: {
					columnWidth: $columnWidth
				},
				animationOptions: {
					duration: 750,
					easing: 'linear',
					queue: false
				}
			});

			// layout Isotope after each image loads
			$isotopeContainer.imagesLoaded().progress( function() {
				$isotopeContainer.isotope('layout');
			});
		}

		$('nav.isotope-filter ul a').on('click', function() {
			var selector = $(this).attr('data-filter');
			$isotopeContainer.isotope({ filter: selector });
			$('nav.isotope-filter ul a').removeClass('active');
			$(this).addClass('active');
			return false;
		});

	}

	// [7. Lightbox]
	function malat_lightbox() {
		if(!$().featherlight) {
			console.log('Featherlight: featherlight not defined.');
			return true;
		}

		$.extend($.featherlight.defaults, {
			closeIcon: '<i class="fas fa-times"></i>'
		});

		$.extend($.featherlightGallery.defaults, {
			previousIcon: '<i class="fas fa-chevron-left"></i>',
			nextIcon: '<i class="fas fa-chevron-right"></i>'
		});

		$.featherlight.prototype.afterOpen = function() {
			$body.addClass('featherlight-open');
		};

		$.featherlight.prototype.afterContent = function() {
			var title = this.$currentTarget.attr('data-title');
			var text = this.$currentTarget.attr('data-text');

			if( !title && !text )
				return;

			this.$instance.find('.caption').remove();

			var title = title ? '<h4 class="title-gallery">' + title + '</h4>' : '',
				text = text ? '<p class="text-gallery">' + text + '</p>' : '';

			$('<div class="caption">').html( title + text ).appendTo(this.$instance.find('.featherlight-content'));
		};

		$.featherlight.prototype.afterClose = function() {
			$body.removeClass('featherlight-open');
		};

		$('a.open-popup-link').featherlight({
			targetAttr: 'href',
			variant: 'featherlight-popup',
			afterOpen: function() {
				if( $navToggle.hasClass('open') ){
					$navToggle.trigger('click');
				}
			}
		});
	}

	// [8. Slider]
	function malat_slider() {
		var $slider = $('.slider');

		if($slider.length > 0){

			if( !$slider.hasClass('slick-initialized') ){
				$slider.slick({
					slidesToShow: 1,
					infinite: true,
					nextArrow: '<button type="button" class="slick-next"><i class="fas fa-angle-right"></i></button>',
					prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-angle-left"></i></button>'
				});
			}

			if( 1199 >= getWindowWidth() && $slider.hasClass('slick-initialized') && $slider.hasClass('slick-destroy-xl') ){
				$slider.slick('unslick');
			}

			if( 991 >= getWindowWidth() && $slider.hasClass('slick-initialized') && $slider.hasClass('slick-destroy-lg') ){
				$slider.slick('unslick');
			}

			if( 767 >= getWindowWidth() && $slider.hasClass('slick-initialized') && $slider.hasClass('slick-destroy-md') ){
				$slider.slick('unslick');
			}

			if( 575 >= getWindowWidth() && $slider.hasClass('slick-initialized') && $slider.hasClass('slick-destroy-sm') ){
				$slider.slick('unslick');
			}

		}
	}

	// [9. Mailchimp]
	function malat_mailchimp() {
		var subscribeForm = $('.subscribe-form');
		if( subscribeForm.length < 1 ){ return true; }

		subscribeForm.each( function(){
			var el = $(this),
				elResult = el.find('.subscribe-form-result');

			el.find('form').validate({
				submitHandler: function(form) {
					elResult.fadeOut( 500 );

					$(form).ajaxSubmit({
						target: elResult,
						dataType: 'json',
						resetForm: true,
						success: function( data ) {
							elResult.html( data.message ).fadeIn( 500 );
							if( data.alert != 'error' ) {
								$(form).clearForm();
								setTimeout(function(){
									elResult.fadeOut( 500 );
								}, 5000);
							};
						}
					});
				}
			});

		});
	}

	// [10. Contact Form]
	function malat_contactForm() {
		var contactForm = $('.contact-form');
		if( contactForm.length < 1 ){ return true; }

		contactForm.each( function(){
			var el = $(this),
				elResult = el.find('.contact-form-result');

			el.find('form').validate({
				submitHandler: function(form) {
					elResult.fadeOut( 500 );

					$(form).ajaxSubmit({
						target: elResult,
						dataType: 'json',
						success: function( data ) {
							elResult.html( data.message ).fadeIn( 500 );
							if( data.alert != 'error' ) {
								$(form).clearForm();
								setTimeout(function(){
									elResult.fadeOut( 500 );
								}, 5000);
							};
						}
					});
				}
			});

		});
	}

	// [11. Plugins]
	function malat_plugins() {

		// Botostrap Tootltips
        $('[data-toggle="tooltip"]').tooltip();

        // Bootstrap Popovers
        $('[data-toggle="popover"]').popover();

		if( $('#typed').length > 0 ){
			var typed = new Typed('#typed', {
				stringsElement: '#typed-strings',
				typeSpeed: 40,
				backDelay: 3000,
				loop: true,
			});
		}
	}

	// window load function
	$(window).on('load', function() {
		malat_preloader();
		malat_spyscroll();
	});

	// document.ready function
	$(document).ready(function() {
		malat_navigation();
		malat_autoHideMobileNavigation();
		malat_spyscroll();
		malat_pageCover();
		malat_backgrounds();
		malat_slider();
		malat_masonryLayout();
		malat_lightbox();
		malat_mailchimp();
		malat_contactForm();
		malat_plugins();
	});

	// window.resize function
	$(window).on('resize', function() {
		malat_responsiveNavigation();
		malat_autoHideMobileNavigation();
		malat_spyscroll();
		malat_backToTop();
		malat_pageCover();
		malat_slider();
		malat_masonryLayout();
	});

	// window.scroll function
	$(window).on('scroll', function(){
		malat_backToTop();
	});

})(jQuery);