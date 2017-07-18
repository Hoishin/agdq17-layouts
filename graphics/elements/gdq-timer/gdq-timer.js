(function () {
	'use strict';

	const stopwatch = nodecg.Replicant('stopwatch');
	const currentRun = nodecg.Replicant('currentRun');

	Polymer({
		is: 'gdq-timer',

		properties: {
			paused: {
				type: Boolean,
				observer: 'pausedChanged',
				reflectToAttribute: true
			},
			finished: {
				type: Boolean,
				observer: 'finishedChanged',
				reflectToAttribute: true
			}
		},

		pausedChanged(newVal) {
			if (newVal && this.finished) {
				this.finished = false;
			}
		},

		finishedChanged(newVal) {
			if (newVal && this.paused) {
				this.paused = false;
			}
		},

		ready() {
			const timerTL = new TimelineLite({autoRemoveChildren: true});

			stopwatch.on('change', (newVal, oldVal) => {
				this.time = newVal.formatted;

				if (newVal.state === 'stopped' && newVal.raw !== 0) {
					this.paused = true;
				} else if (newVal.state === 'finished') {
					this.finished = true;
				} else {
					this.paused = false;
					this.finished = false;
				}

				if (newVal.state !== 'running') {
					timerTL.clear();
				}
			});

			currentRun.on('change', this.currentRunChanged.bind(this));
		},

		currentRunChanged(newVal) {
			this.estimate = newVal.estimate;
			this.$.estimate.innerHTML = '予定タイム ' + this.estimate;

			if (this.initialized) {
				this.fitText();
			} else {
				this.async(this.fitText, 500);
				this.initialized = true;
			}
		},

		fitText() {
			Polymer.dom.flush();
			textFit(this.$.estimate, {});
		}
	});
})();
