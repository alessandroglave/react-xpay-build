import { ERRORS, NexiUrl, XPay, XPaySdkParams } from "../../types";

let XPayPromise: Promise<XPay | null> | null = null;

export const loadScript = (
	params: XPaySdkParams
): Promise<XPay | null> => {

	// load nexi sdk once
	if (XPayPromise !== null) {
		return XPayPromise;
	}
	XPayPromise = new Promise((resolve, reject) => {
		// handle ssr
		if (typeof window === "undefined") {
			resolve(null);
			return;
		}
		if (window.XPay) {
			console.warn(ERRORS.SCRIPT_EXISTS);
		}
		if (window.XPay) {
			resolve(window.XPay);
			return;
		}
		try {
			let script = findScript(params);

			if (script) {
				console.warn(ERRORS.SCRIPT_EXISTS);
			} else if (!script) {
				script = injectScript(params);
			}

			script.addEventListener("load", () => {
				if (window.XPay) {
					console.log("XPay script loaded");
					resolve(window.XPay);
				} else {
					console.warn(ERRORS.SDK_NOT_AVAILABLE);
					reject(new Error(ERRORS.SDK_NOT_AVAILABLE));
				}
			});
			
			script.addEventListener("error", () => {
				console.warn(ERRORS.FAILED_TO_LOAD);
				reject(new Error(ERRORS.FAILED_TO_LOAD));
			});
		} catch (error) {
			console.warn(error);
			reject(error);
			return;
		}
	});
	return XPayPromise;
};

export const findScript = (
	params: XPaySdkParams
): HTMLScriptElement | null => {
	const nexiurl = getNexiUrl(params, true);
	const scripts = document.querySelectorAll<HTMLScriptElement>(
		`script[src^="${nexiurl}"]`
	);

	for (let i = 0; i < scripts.length; i++) {
		const script = scripts[i];
		if (!script.src.includes(nexiurl)) {
			continue;
		}
		return script;
	}
	return null;
};

const injectScript = (
	params: XPaySdkParams
): HTMLScriptElement => {
	const script = document.createElement("script");
	script.src = `${getNexiUrl(params, false)}`;
	const target = document.head || document.body;
	if (!target) {
		throw new Error(ERRORS.SCRIPT_INJECT);
	}
	target.appendChild(script);
	return script;
};



const getNexiUrl = (
	{alias, isProduction, url}: XPaySdkParams,
	short = false
) => {
	if (url) {
		return url + alias;
	}

	if (short) {
		return isProduction ? NexiUrl.PRODUCTION : NexiUrl.TEST;
	}

	return isProduction
		? NexiUrl.PRODUCTION + "?alias=" + alias
		: NexiUrl.TEST + "?alias=" + alias;
};
