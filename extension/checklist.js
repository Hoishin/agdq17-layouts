'use strict';

const equals = require('deep-equal');
const clone = require('clone');
const obsWebsocket = require('./obs-websocket');

module.exports = function (nodecg) {
	// Create defaults array
	const checklistDefault = {
		dashboardDuties: [
			{name: '走者の情報を確認', complete: false},
			{name: 'ゲームの情報を確認', complete: false},
			{name: '技術メモ確認', complete: false},
			{name: 'FTL, RTMPかどうか確認', complete: false},
			{name: 'レイアウトが合っている', complete: false}
		],
		obsDuties: [
			{name: '走者とゲームの位置が一致', complete: false},
			{name: 'ゲーム画面をクロップ', complete: false},
			{name: 'ゲームと声のバランス', complete: false},
			{name: 'アニメーション問題なし', complete: false},
			{name: '走者にゴーサイン', complete: false}
		]
	};

	// Instantiate replicant with defaults object, which will load if no persisted data is present.
	const checklist = nodecg.Replicant('checklist', {defaultValue: checklistDefault});

	// Reconcile differences between persisted value and what we expect the checklistDefault to be.
	const persistedValue = checklist.value;
	if (!equals(persistedValue, checklistDefault)) {
		const mergedChecklist = clone(checklistDefault);

		for (const category in checklistDefault) {
			if (!{}.hasOwnProperty.call(checklistDefault, category)) {
				continue;
			}

			mergedChecklist[category] = checklistDefault[category].map(task => {
				if (persistedValue[category]) {
					const persistedTask = persistedValue[category].find(({name}) => name === task.name);
					if (persistedTask) {
						return persistedTask;
					}
				}

				return task;
			});
		}

		checklist.value = mergedChecklist;
	}

	const checklistComplete = nodecg.Replicant('checklistComplete', {defaultValue: false});
	checklist.on('change', newVal => {
		let foundIncompleteTask = false;

		for (const category in newVal) {
			if (!{}.hasOwnProperty.call(newVal, category)) {
				continue;
			}

			foundIncompleteTask = newVal[category].some(task => !task.complete);

			if (foundIncompleteTask) {
				break;
			}
		}

		checklistComplete.value = !foundIncompleteTask;
	});

	return {
		reset() {
			obsWebsocket.resetCropping();
			for (const category in checklist.value) {
				if (!{}.hasOwnProperty.call(checklist.value, category)) {
					continue;
				}

				checklist.value[category].forEach(task => {
					task.complete = false;
				});
			}
		}
	};
};
