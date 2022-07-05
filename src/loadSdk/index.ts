import { loadScript } from "loadSdk/methods";
import { XPay, LoadXPay, XPaySdkParams } from "../types";

let loadSdkCalled = false;

export const loadXPay: LoadXPay = (args: XPaySdkParams) => {
	if (loadSdkCalled) {
		console.warn("Library already initialized");
	}
	loadSdkCalled = true;
	return loadScript(args).then((xpay) => initXPay(xpay, args));
};

export const initXPay = (
	xpay: XPay | null,
	args: XPaySdkParams
): XPay | null => {
	if (xpay === null) {
		return null;
	}
	const XPay = {
		...xpay,
		argsAPIKEY: args.alias,
		argsENVIRONMENT: args.isProduction,
	};
	return XPay;
};
