// setImmediate が削除されたための対応 
// fix(env-jsdom): remove setImmediate and clearImmediate #11222
// https://github.com/facebook/jest/pull/11222
import * as timers from "timers"
if(typeof setImmediate !== "function") {
	global.setImmediate = timers.setImmediate
	global.clearImmediate = timers.clearImmediate
}

window.HTMLMediaElement.prototype.play = () => { /* do nothing */ };
window.HTMLMediaElement.prototype.pause = () => { /* do nothing */ };