(function ($) {
	jQuery.fn.pomodoro = function (options) {
		return this.each(function () {
			Pomodoro.init(this, options);
		});
	};

	Pomodoro = {
		options: {
			workLength: 25 * 60,
			breakLength: 5 * 60,
			containerEl: '#pomodoro',
			breakEl: '#break',
			workEl: '#work',
			timerEl: '.timer',
			startControlEl: '#start',
			resetControlEl: '#reset',
			workClass: 'work',
			breakClass: 'break',
			startCallback: function () {},
			resetCallback: function () {}
		},
		element: null,
		timer: null,
		init: function (el, newOptions) {
/*			
      var breakClasses = $(Pomodoro.options.breakEl).attr("class");
			breakClasses.each(function (i) {
				var index = this.indexOf("time_"); 
				if (index == 0) {
					Pomodoro.options.breakLength = parseInt(this.substring(5));
				}
			});
			var workClasses = $(Pomodoro.options.workEl).attr("class");
			workClasses.each(function (i) {
				var index = this.indexOf("time_"); 
				if (index == 0) {
					Pomodoro.options.workLength = parseInt(this.substring(5));
				}
			}); 
*/						
			$.extend(Pomodoro.options, newOptions);
			
			Pomodoro.element = el;
			$(Pomodoro.element).find(Pomodoro.options.startControlEl).click(Pomodoro.start).click(Pomodoro.options.startCallback);
			$(Pomodoro.element).find(Pomodoro.options.resetControlEl).click(Pomodoro.reset).click(Pomodoro.options.resetCallback);

			Pomodoro.timer = Timer;
			Pomodoro.timer.display(Pomodoro.options.timerEl, Pomodoro.options.workLength * 1000);	
		},
		start: function () {
			Pomodoro.startWork();
			return false;
		},
		startWork: function () {
			$(Pomodoro.options.containerEl).removeClass(Pomodoro.options.breakClass).addClass(Pomodoro.options.workClass);
			Pomodoro.timer.start(Pomodoro.options.timerEl, Pomodoro.options.workLength, Pomodoro.startBreak);
		},
		startBreak: function () {
			$(Pomodoro.options.containerEl).removeClass(Pomodoro.options.workClass).addClass(Pomodoro.options.breakClass);
			Pomodoro.timer.start(Pomodoro.options.timerEl, Pomodoro.options.breakLength, Pomodoro.startWork);
		},
		reset: function () {
			Pomodoro.timer.reset();
			$(Pomodoro.options.containerEl).removeClass(Pomodoro.options.breakClass).addClass(Pomodoro.options.workClass);
			Pomodoro.timer.display(Pomodoro.options.timerEl, Pomodoro.options.workLength * 1000);
			return false;
		}
	};

	Timer = {
		sec: 1000,
		min: 1000 * 60,
		hour: 1000 * 60 * 60,
		endTime: 0,
		el: "",
		state: 0, /* states = [ 0: stopped, 1: started ] */
		callback: null,
		getTime: function () {
			return new Date().getTime();
		},
		start: function (el, end, callback) {
			Timer.state = 1;
			Timer.el = el;
			Timer.callback = callback;
			Timer.setEndTime(end);
			Timer.update();
		},
		reset: function () {
			Timer.state = 0;
		},
		display: function (el, time) {
			$(el).html(TimeFormatter.format(time));
		},
		update: function () {
			if (Timer.state > 0) {
				Timer.display(Timer.el, Timer.getTimeLeft());
				var totalSecs = parseInt(Timer.getTimeLeft() / Timer.sec);
				if (totalSecs <= 0) { 
					Timer.state = 0;
					setTimeout(Timer.callback, 1000);
				} else {
					setTimeout(Timer.update, 100);
				}
			}
		},
		getTimeLeft: function () {
			var end = Timer.getEndTime();
			var now = Timer.getTime();
			var left = end - now;
			return left;
		},
		setEndTime: function (secs) {
			Timer.endTime = new Date().getTime() + (secs * Timer.sec);
		},
		getEndTime: function () {
			return Timer.endTime;
		}
	};

	TimeFormatter = {
		format: function (time) {
			var totalSecs = time / Timer.sec;
		    var mins = parseInt(totalSecs /60);
		    var secs = parseInt(totalSecs % 60);
		    
		    return TimeFormatter.formatMins(mins) + ":" + TimeFormatter.formatSecs(secs);
		     
		},
		formatSecs: function (time) {
			var time_s = time; 
			if (time < 10) {
				time_s = "0" + time_s;
			}
			return time_s;
		},
		formatMins: function (time) {
			var time_s = time; 
			if (time <= 0) {
				time_s = "";
			}
			return time_s;
		}
	};
})(jQuery);