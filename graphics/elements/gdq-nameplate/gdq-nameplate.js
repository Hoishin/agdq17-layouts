(function () {
	'use strict';

	const NAME_FADE_DURATION = 0.33;
	const NAME_FADE_IN_EASE = Power1.easeOut;
	const NAME_FADE_OUT_EASE = Power1.easeIn;
	const currentRun = nodecg.Replicant('currentRun');
	const stopwatch = nodecg.Replicant('stopwatch');

	Polymer({
		is: 'gdq-nameplate',

		properties: {
			index: Number,
			finished: {
				type: Boolean,
				reflectToAttribute: true,
				value: false
			},
			time: String,
			name: {
				type: String,
				value: ''
			},
			twitch: {
				type: String,
				value: ''
			},
			nico: {
				type: String,
				value: ''
			},
			twitter: {
				type: String,
				value: ''
			}
		},

		ready() {
			// Create looping anim for main nameplate.
			this.nameTL = new TimelineMax({repeat: -1, paused: true});
			this.nameTL.to(this.$.names, NAME_FADE_DURATION, {
				onStart: function() {
					this.$.namesTwitch.classList.add('hidden');
					this.$.namesNico.classList.add('hidden');
					this.$.namesTwitter.classList.add('hidden');
					this.$.timeResult.classList.add('hidden');
					if (this.ifShow[0] == 'twitch') {
						this.$.namesTwitch.classList.remove('hidden');
					} else if (this.ifShow[0] == 'nico') {
						this.$.namesNico.classList.remove('hidden');
					} else if (this.ifShow[0] == 'twitter') {
						this.$.namesTwitter.classList.remove('hidden');
					}
					this.ifShow.push(this.ifShow.shift());
				}.bind(this),
				opacity: 1,
				ease: NAME_FADE_IN_EASE
			});
			this.nameTL.to(this.$.names, NAME_FADE_DURATION, {
				onStart: function() {
				},
				opacity: 0,
				ease: NAME_FADE_OUT_EASE
			}, '+=10');

			// Attach replicant change listeners.
			currentRun.on('change', this.currentRunChanged.bind(this));
			stopwatch.on('change', this.stopwatchChanged.bind(this));
		},

		// Uses array to control sub-plate rotation
		currentRunChanged(newVal, oldVal) {
			// If nothing has changed, do nothing.
			if (oldVal && JSON.stringify(newVal.runners) === JSON.stringify(oldVal.runners)) {
				return;
			}
			this.ifShow = [];

			TweenLite.to(this.$.names, NAME_FADE_DURATION, {
				opacity: 0,
				ease: NAME_FADE_OUT_EASE,
				onComplete: function () {
					const runner = newVal.runners[this.index];
					if (runner) {
						this.name = runner.name;
						if (runner.twitch) {
							this.twitch = runner.twitch;
							this.ifShow.push('twitch');
						} else {
							this.twitch = '';
						}
						if (runner.nico) {
							this.nico = runner.nico;
							this.ifShow.push('nico');
						} else {
							this.nico = '';
						}
						if (runner.twitter) {
							this.twitter = runner.twitter;
							this.ifShow.push('twitter');
						} else {
							this.twitter = '';
						}
					} else {
						this.twitch = '?';
						this.nico = '?';
						this.twitter = '?';
						this.name = '?';
					}
					if (this.ifShow === []) {
						this.nameTL.pause();
						this.hideAll();
					} else if (this.ifShow.toString() === 'twitch') {
						this.nameTL.pause();
						this.$.namesTwitch.classList.remove('hidden');
						this.$.namesNico.classList.add('hidden');
						this.$.namesTwitter.classList.add('hidden');
						this.$.timeResult.classList.add('hidden');
						TweenLite.to(this.$.names, NAME_FADE_DURATION, {opacity: 1, ease: NAME_FADE_IN_EASE});
					} else if (this.ifShow.toString() === 'nico') {
						this.nameTL.pause();
						this.$.namesTwitch.classList.add('hidden');
						this.$.namesNico.classList.remove('hidden');
						this.$.namesTwitter.classList.add('hidden');
						this.$.timeResult.classList.add('hidden');
						TweenLite.to(this.$.names, NAME_FADE_DURATION, {opacity: 1, ease: NAME_FADE_IN_EASE});
					} else if (this.ifShow.toString() === 'twitter') {
						this.nameTL.pause();
						this.$.namesTwitch.classList.add('hidden');
						this.$.namesNico.classList.add('hidden');
						this.$.namesTwitter.classList.remove('hidden');
						this.$.timeResult.classList.add('hidden');
						TweenLite.to(this.$.names, NAME_FADE_DURATION, {opacity: 1, ease: NAME_FADE_IN_EASE});
					} else {
						this.nameTL.restart();
					}
					this.async(this.fitName, 500);
				}.bind(this)
			});
		},

		fitName() {
			Polymer.dom.flush();
			const MAX_NAME_WIDTH = this.$.name.clientWidth - 20;
			const nameWidth = this.$.namesName.clientWidth;
			if (nameWidth > MAX_NAME_WIDTH) {
				TweenLite.set(this.$.namesName, {scaleX: MAX_NAME_WIDTH / nameWidth});
			} else {
				TweenLite.set(this.$.namesName, {scaleX: 1});
			}

			const MAX_TWITCH_WIDTH = MAX_NAME_WIDTH - 20;
			const twitchSpan = this.$.namesTwitch.querySelector('span');
			twitchSpan.style.width = 'auto';
			const twitchWidth = twitchSpan.clientWidth;
			if (twitchWidth > MAX_TWITCH_WIDTH) {
				const scale = MAX_TWITCH_WIDTH / twitchWidth;
				const newWidth = twitchWidth * scale;
				if (typeof newWidth === 'number' && !isNaN(newWidth)) {
					TweenLite.set(twitchSpan, {scaleX: scale, width: newWidth});
				}
			} else {
				TweenLite.set(twitchSpan, {scaleX: 1});
			}
		},

		showTime() {
			if (this._timeShowing) {
				return;
			}
			this._timeShowing = true;

			this.nameTL.pause();
			this.$.namesTwitch.classList.add('hidden');
			this.$.namesNico.classList.add('hidden');
			this.$.namesTwitter.classList.add('hidden');
			this.$.timeResult.classList.remove('hidden');
			this.$.names.style.opacity = 1;
			TweenLite.from(this.$.names, NAME_FADE_DURATION, {y: -30, ease: NAME_FADE_IN_EASE});
		},

		hideTime() {
			if (!this._timeShowing) {
				return;
			}
			this._timeShowing = false;

			if (this.nameTL.paused()) {
				this.nameTL.restart();
			}
		},

		stopwatchChanged(newVal) {
			if (newVal.results[this.index] && !newVal.results[this.index].forfeit) {
				this.time = newVal.results[this.index].formatted;
				this.showTime();
				this.finished = true;
			} else {
				this.hideTime();
				this.finished = false;
			}
		}
	});
})();
