/**
 * jQuery multiEmail plugin.
 *
 * @author Aliaksandr Astashenkau
 * @author-email dfsq.dfsq@gmail.com
 * @author-website http://dfsq.info
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 * @version 0.6
 */
;(function($) {
	$.fn.multiEmail = function(options) {

		/**
		 * Default multiEmail options
		 *
		 * max: [Number:null] Maximum number of emails allowed to input.
		 * fieldClass: [String:multiemail-cont] Css class name for the pseudo input container.
		 * addClass: [String:null] Additional css class to be added to pseudo input container.
		 * fieldCss: [Object:null] Css rules to be aplyed to input container.
		 * placeholder: [String:null] To use some placeholder value, e.g. Type email address.
		 * values: [String:null] Comma separated list of initially set emails.
		 * removeHtml: [String:'x'] Remove email element symbol.
		 * label: [Bollean:true] Wether to use label for this email field.
		 */
		var options = $.extend({
			max: null,
			fieldClass: 'multiemail-cont',
			addClass: null,
			fieldCss: null,
			placeholder: null,
			values: null,
			removeHtml: 'x',
			label: true
		}, options);

		var Control = function($inp) {

			// pseudo input div
			var $cont;

			// real input
			var $input;

			// hidden div used for calculating width of input
			var $twin;

			var $placeholder = null;

			/**
			 * Create new div element on place of input (textarea).
			 * We can't copy all the styles so we will just use width, height.
			 */
			var init = function() {
				$inp.hide();

				$cont = $('<div>', {
					'class': options.fieldClass,
					'css': $.extend({
						'width': $inp.outerWidth()
					}, options.fieldCss)
				}).insertAfter($inp);

				$cont.append(createInput());
				$cont.append(createTwin());

				if (options.label) {
					initLabel();
				}

				if (options.values) {
					initValues();
				}

				if (options.placeholder) {
					$cont.append(createPlaceholder());
				}

				$cont.click(function() {
					if (options.placeholder) {
						$placeholder.hide();
						$input.show();
					}
					$input.focus();
				});
			};

			var createInput = function() {
				$input = $('<input>', {
					'type': 'text',
					'class': 'multiemail-input'
				});

				/**
				 * 8 - backspace, 32 - space, 188 - comma
				 */
				$input.keyup(function(e) {
					var k = e.keyCode;
					var email = $.trim($(this).val());

					if (k == 8 && email.length == 0) {
						var $emailItem = $(this).prev();
						if ($emailItem.hasClass('selected')) {
							removeEmailItem($emailItem);
						}
						else {
							$emailItem.addClass('selected');
						}
					}
					else if (k == 32 || k == 188) {

						if (options.max) {
							var count = $cont.find('.multiemail-email').length;
							if (count >= options.max) {
								return false;
							}
						}

						email = email.replace(/,*$/, '');

						if (!validEmail(email)) {
							return false;
						}

						addEmailItem(email);
					}
					else  if (k == 37) {
						// left arrow
						var sel = $cont.find('.selected');
						if (!sel.length) {
							$(this).prev().addClass('selected');
						}
						else {
							sel.removeClass('selected').prev().addClass('selected');
						}
					}
					else if (k == 39) {
						// right arrow
						var sel = $cont.find('.selected');
						if (sel.length) {
							sel.removeClass('selected').next().addClass('selected');
						}
					}
					else if (k == 46) {
						$cont.find('.selected .multiemail-close').trigger('click');
					}
					else {
						$twin.text(email);
						$(this).width($twin.width() + 25);
					}
				});

				if (options.placeholder) {
					$input.blur(function() {
						if (!$(this).val() && !$(this).prev().is('.multiemail-email')) {
							$placeholder.show();
							$(this).hide();
						}
					});
				}

				return $input;
			};

			var initLabel = function() {
				var name = $inp.attr('name');
				$("label[for='" + name + "']").click(function() {
					$cont.trigger('click');
				});
			};

			var createTwin = function() {
				$twin = $('<div>', {
					'class': 'multiemail-twin'
				});

				return $twin;
			};

			var createPlaceholder = function() {
				$placeholder = $('<a>', {
					'class': 'multiemail-placeholder',
					'text': options.placeholder,
				}).css('display', 'inline-block');

				$cont.append($placeholder);

				if (!options.values) {
					$input.hide();
					$placeholder.show();
				}
			};

			var initValues = function() {
				var emails = options.values.split(',');
				var max = (options.max && options.max < emails.length) ? options.max : emails.length;
				for (var i=0; i<max; i++) {
					addEmailItem($.trim(emails[i], true));
				}
			};

			/**
			 * Add new email item
			 */
			var addEmailItem = function(email, init) {
				var $email = $('<a>', {
					'class': 'multiemail-email',
					'text': email,
					'click': function() {
						if (!$(this).hasClass('selected')) {
							$cont.find('.selected').removeClass('selected');
							$(this).addClass('selected');
						}
						else {
							$(this).removeClass('selected');
						}
					}
				});

				$email.append($('<input>', {
					'type': 'hidden',
					'name': $inp.attr('name') + '[]',
					'value': email
				}));

				$email.append($('<span>', {
					'class': 'multiemail-close',
					'html': options.removeHtml,
					'click': function() {
						removeEmailItem($(this).parent());
					}
				}));

				$input.before($email).val('');
				if (typeof init == 'undefined') {
					$input.trigger('keyup');
				}
			};

			/**
			 * Remove email if "x" clicked or backspace pressed
			 */
			var removeEmailItem = function($emailItem) {
				$emailItem.remove();
			};

			var validEmail = function(str) {
				return /^[a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(str);
			};

			return {
				create: function() {
					init();
				}
			};
		};

		return this.each(function() {
			if (!$(this).is(':text') && !$(this).is('textarea') || !$(this).attr('name')) {
				return false;
			}
			var contr = new Control($(this));
			contr.create();
		});
	};
})(jQuery);