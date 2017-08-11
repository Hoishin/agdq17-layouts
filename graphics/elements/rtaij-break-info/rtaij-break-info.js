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

      // Show from next run if setup block
      let nextRunAdjust;
      if (schedule.value[newVal.order - 1].notes === 'break') {
        nextRunAdjust = 1;
      } else {
        nextRunAdjust = 2;
      }

      if (!schedule.value[newVal.order + this.index - nextRunAdjust]) {
        this.$.upNextInfo.classList.add('hidden');
        return;
      }

      this.showingRun = schedule.value[newVal.order + this.index - nextRunAdjust];
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
