(function () {
	'use strict';

	const currentRun = nodecg.Replicant('currentRun');

	Polymer({
		is: 'gdq-runinfo',

		properties: {
			maxNameSize: {
				type: Number,
				value: 45
			},
			maxInfoSize: {
				type: Number,
				value: 30
			},
			singleLineName: {
				type: Boolean,
				reflectToAttribute: true,
				value: false
			}
		},

		ready() {
			currentRun.on('change', this.currentRunChanged.bind(this));
		},

		currentRunChanged(newVal) {
			this.name = newVal.name.replace('\\n', this.singleLineName ? ' ' : '<br/>');
			this.category = newVal.category;
			this.console = newVal.console;

			this.$.name.innerHTML = this.name;
			this.$.runInfo.innerHTML = this.category + " - " + this.console;

			// Avoids some issues that can arise on the first time that fitText is run.
			// Currently unsure why these issues happen.
			if (this.initialized) {
				this.fitText();
			} else {
				this.async(this.fitText, 500);
				this.initialized = true;
			}
		},

		fitText() {
			Polymer.dom.flush();
			textFit(this.$.name, {/*maxFontSize: this.maxNameSize*/});
			textFit(this.$.runInfo, {/*maxFontSize: this.maxInfoSize*/});
		},
	});
})();
