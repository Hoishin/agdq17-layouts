(function() {
  'use strict';

  const schedule = nodecg.Replicant('schedule');
  const currentRun = nodecg.Replicant('currentRun');

  Polymer({
    is: 'rtaij-break-info',

    properties: {
      index: Number
    },

    ready() {
      currentRun.on('change', this.currentRunChanged.bind(this));
      setInterval(this.remainingTime.bind(this), 60 * 1000);
    },

    currentRunChanged(newVal) {
      this.$.upNextInfo.classList.remove('hidden');

      let adjust = 0;
      function skip(index) {
        const runOfIndex = schedule.value[newVal.order - 1 + index - 1]
        if (runOfIndex && runOfIndex.name === 'セットアップ') {
          adjust++;
        }
      }

      switch (this.index) {
        case 3:
          skip(3);
        case 2:
          skip(2);
        case 1:
          skip(1);
      }

      this.showingRun = schedule.value[newVal.order - 1 + this.index - 1 + adjust];
      if (!this.showingRun) {
        this.$.upNextInfo.classList.add('hidden');
        return;
      } else {
        console.log('no');
      }
      this.name = this.showingRun.name;
      this.category = this.showingRun.category;
      this.console = this.showingRun.console;

      // Show runnners name with "," if there are multiple runners
      if (this.showingRun.runners.length === 1) {
        this.runners = this.showingRun.runners[0].name;
      } else {
        this.runners = this.showingRun.runners.slice(1).reduce((prev, curr, index, array) => {
          return `${prev}, ${curr.name}`;
        }, this.showingRun.runners[0].name);
      }


      this.$.runnerInfo.innerHTML = this.category + " | 走者：" + this.runners;

      this.remainingTime();
      this.async(this.fitName, 200);
    },

    // Show time remaining until the run
    remainingTime() {
      this.startTime = this.showingRun.startTime;
      if (this.index == 1) {
        this.time = "このあとすぐ！";
      } else {
        this.time = this.formatRemaning(this.startTime - Math.floor(Date.now() / 1000));
      }
    },
    formatRemaning(inSeconds) {
      if (inSeconds < 0) {
        return "あと0時間0分";
      }
  		const seconds = inSeconds % 60;
  		const minutes = ((inSeconds - seconds) / 60) % 60;
  		const hours = Math.floor(inSeconds / (60 * 60));
  		return "あと" + hours + "時間" + minutes + "分";
  	},

    fitName() {
      Polymer.dom.flush();
      const MAX_NAME_WIDTH = this.$.game.clientWidth;
      const nameWidth = this.$.gameName.clientWidth;
      if (nameWidth > MAX_NAME_WIDTH) {
        TweenLite.set(this.$.gameName, {scaleX: MAX_NAME_WIDTH / nameWidth});
      } else {
        TweenLite.set(this.$.gameName, {scaleX: 1});
      }

      const MAX_RUNNER_WIDTH = this.$.runners.clientWidth;
      const runnerWidth = this.$.runnerInfo.clientWidth;
      if (runnerWidth > MAX_RUNNER_WIDTH) {
        TweenLite.set(this.$.runnerInfo, {scaleX: MAX_RUNNER_WIDTH / runnerWidth});
      } else {
        TweenLite.set(this.$.runnerInfo, {scaleX: 1});
      }
    }
   });
})();
