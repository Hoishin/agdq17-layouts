(function () {
	'use strict';

	Polymer({
		is: 'gdq-run-editor',

		properties: {
			showingOriginal: {
				type: Boolean,
				value: false
			}
		},

		loadRun(run) {
			this.name = run.name;
			this.category = run.category;
			this.estimate = run.estimate;
			this.console = run.console;
			this.releaseYear = run.releaseYear;
			this.runners = run.runners.map(runner => {
				if (runner) {
					return {name: runner.name, twitch: runner.twitch, nico: runner.nico, twitter: runner.twitter};
				}

				return undefined;
			});
			this.coop = run.coop;
			this.originalValues = run.originalValues;
			this.pk = run.pk;
		},

		applyChanges() {
			// We have to build a new runners object.
			const runners = [];
			const runnerNameInputs = Polymer.dom(this.$.runners).querySelectorAll('paper-input[label^="走者"]:not([disabled])');
			const runnerTwitchInputs = Polymer.dom(this.$.runners).querySelectorAll('paper-input[label="Twitch"]:not([disabled])');
			const runnerNicoInputs = Polymer.dom(this.$.runners).querySelectorAll('paper-input[label="ニコ生"]:not([disabled])');
			const runnerTwitterInputs = Polymer.dom(this.$.runners).querySelectorAll('paper-input[label="ツイッター"]:not([disabled])');
			for (let i = 0; i < 4; i++) {
				if (runnerNameInputs[i].value || runnerTwitchInputs[i].value || runnerNicoInputs[i].value || runnerTwitterInputs[i].value) {
					runners[i] = {
						name: runnerNameInputs[i].value,
						twitch: runnerTwitchInputs[i].value,
						nico: runnerNicoInputs[i].value,
						twitter: runnerTwitterInputs[i].value
					};
				}
			}

			nodecg.sendMessage('modifyRun', {
				name: this.name,
				category: this.category,
				estimate: this.estimate,
				console: this.console,
				releaseYear: this.releaseYear,
				coop: this.coop,
				runners,
				pk: this.pk
			}, () => {
				nodecg.getDialog('edit-run').close();
			});
		},

		resetRun() {
			nodecg.sendMessage('resetRun', this.pk, () => {
				nodecg.getDialog('edit-run').close();
			});
		},

		calcHide(path, showingOriginal) {
			path = path.split('.');
			const originalPath = path.slice(0);
			originalPath.unshift('originalValues');
			const originalValue = this.get(originalPath);
			const hasOriginal = typeof originalValue !== 'undefined';
			return showingOriginal && hasOriginal;
		},

		updateValue() {
			console.log('updateValue', arguments);
		},

		showOriginal() {
			this.showingOriginal = true;
		},

		hideOriginal() {
			this.showingOriginal = false;
		}
	});
})();
