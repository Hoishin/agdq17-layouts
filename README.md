# rtaij-layouts

[![Greenkeeper badge](https://badges.greenkeeper.io/Hoishin/rtaij-layouts-legacy.svg)](https://greenkeeper.io/)

This is sets of on-stream layouts that RTA in Japan uses for speedrunning events. RTA in Japan is offline/online speedrunning marathon. It has held 3 events since December 2016, this layouts are used from "RTA in Japan Online" in August 2017.  
これはRTA in JapanというRTAイベントで使われた配信用レイアウトです。RTA in Japanは2016年冬に第1回が開催された、大規模RTAイベントで、今まで3回開催されています。このレイアウトは2017年8月のRTA in Japan Onlineで使われたものです。

This is a [NodeCG](http://github.com/nodecg/nodecg) 0.8 bundle. You will need to have NodeCG 0.8 installed to run it.  
このレイアウトを使うには[NodeCG](http://github.com/nodecg/nodecg)が必要です。バージョンは0.8に対応しています。

## Based on GDQ layouts

This layouts are originally agdq17-layouts made by SupportClass. This layouts are forked and modified to fit the event.  
このレイアウトはSupportClassが製作したAGDQ2017で使われたレイアウトを元に、RTA in Japanに合うように機能を追加削除したものです。

## Video Breakdown
[![screenshot](https://i.imgur.com/aVCCgYZ.png)
A twelve-part video series explaining the structure and function of agdq17-layouts NodeCG bundle. The final videos in the series also walk through the setup process.  
AGDQ2017で使用されたレイアウトのチュートリアルです。このレイアウトの基本はこのビデオで説明されています。](https://www.youtube.com/watch?v=vBAZXchbI3U&list=PLTEhlYdONYxv1wk2FsIpEz92X3x2E7bSx)


## Installation
- Install to `nodecg/bundles/agdq17-layouts`.
- Install `bower` if you have not already (`npm install -g bower`)
- **WINDOWS**: Install [`windows-build-tools`](https://www.npmjs.com/package/windows-build-tools) to install the tools necessary to compile `agdq17-layouts`' dependencies.
- **LINUX**: Install `build-essential` and Python 2.7, which are needed to compile `agdq17-layouts`' dependencies.
- `cd nodecg/bundles/agdq17-layouts` and run `npm install --production`, then `bower install`
- Create the configuration file (see the [configuration][id] section below for more details)
- Run the nodecg server: `nodecg start` (or `node index.js` if you don't have nodecg-cli) from the `nodecg` root directory.

Please note that you **must manually run `npm install` for this bundle**. NodeCG currently cannot reliably
compile this bundle's npm dependencies. This is an issue we hope to address in the future.

**Please note that by default, the break screen graphic will not work.** This is because this graphic uses
a paid library called [SplitText](https://greensock.com/SplitText), which we cannot redistribute. If you wish to use the break screen with its current implementation, you will need to pay for access to SplitText and save a copy to `graphics/imports/SplitText.min.js`.

## Usage
This bundle is not intended to be used verbatim. Some of the assets have been replaced with placeholders, and
most of the data sources are hardcoded. We are open-sourcing this bundle in hopes that people will use it as a
learning tool and base to build from, rather than just taking and using it wholesale in their own productions.

To reiterate, please don't just download and use this bundle as-is. Build something new from it.

### Running a mock donation server.
`agdq17-layouts` breaks from previous GDQ layout bundles in that it listens for donations in realtime,
rather than polling the donation tracker for a new donation total once a minute. To facilitate testing,
we provide a small script that sends mock donations:

1. Add `"donationSocketUrl": "http://localhost:22341"` to your `nodecg/cfg/agdq17-layouts.json`
2. From the `nodecg/bundles/agdq17-layouts` folder, run `npm run mock-donations`
3. Run NodeCG (`nodecg start` or `node index.js` from the `nodecg` folder)

[id]: configuration
## Configuration
To configure this bundle, create and edit `nodecg/cfg/agdq17-layouts.json`.  
Refer to [configschema.json][] for the structure of this file.
[configschema.json]: configschema.json

Example config:
```json
{
	"useMockData": true,
	"displayDuration": 10,
	"osc": {
		"address": "192.168.1.10",
		"gameAudioChannels": [
			{
				"sd": 17,
				"hd": 25
			},
			{
				"sd": 19,
				"hd": 27
			},
			{
				"sd": 21,
				"hd": null
			},
			{
				"sd": 23,
				"hd": null
			}
		]
	},
	"twitter": {
		"userId": "1234",
		"consumerKey": "aaa",
		"consumerSecret": "bbb",
		"accessTokenKey": "ccc",
		"accessTokenSecret": "ddd"
	},
	"enableTimerSerial": false,
	"streamTitle": "EVENT NAME - ${gameName}",
	"footpedal": {
		"enabled": false,
		"buttonId": 31
	},
	"obsWebsocket": {
		"address": "localhost",
		"password": "your_password"
	},
	"firebase": {
		"databaseURL": "https://your-firebase-app.firebaseio.com",
		"paste": "your",
		"firebase": "credentials",
		"into": "here"
	}
}
```

## Troubleshooting
### I hear crackling in my USB audio devices when running agdq17-layouts
This can happen when `footpedal.enabled` is set to `true` in your `nodecg/cfg/agdq17-layouts`.
The underlying code polls USB devices every 500ms, and on some devices this polling can cause crackling.
To fix the crackling, set `footpedal.enabled` back to `false`. This unfortunately does mean that you will be unable
to use the footpedal functionality.

## License
agdq17-layouts is provided under the Apache v2 license, which is available to read in the [LICENSE][] file.
[license]: LICENSE

### Credits
Originally designed & developed by [Support Class](http://supportclass.net/)
 - [Alex "Lange" Van Camp](https://twitter.com/VanCamp/)  
 - [Chris Hanel](https://twitter.com/ChrisHanel)

Modified by [RTA in Japan]()
 - [Hoishin](https://twitter.com/hoishinxii)
 - [Mokapeer](https://twitter.com/moka_peer)
