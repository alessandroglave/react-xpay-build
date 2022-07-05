import { CustomConfigI, ERRORS, GenericObject, OrderInterface, XPay } from "../../types";
import { isPromise, isXPay } from "../../utils/utils";

/**
 * Builds initial XPay config object
**/
export function buildConfig(
	apiKey: string,
	order: OrderInterface,
	XPay: XPay,
	customConfig: null | CustomConfigI
): GenericObject {
	const config = {
		baseConfig: {
			apiKey: apiKey,
			enviroment: XPay.Environments.INTEG,
		},
		paymentParams: {
			amount: order.amount,
			transactionId: order.transactionId,
			currency: order.currency,
			timeStamp: order.timeStamp,
			mac: order.mac,
			url: order.url,
			urlBack: order.urlBack,
		},
		customParams: {},
		language: XPay.LANGUAGE.ITA,
	};
	const newConfig = {
		...config,
		...(customConfig && {
			...(customConfig.main && { ...customConfig.main }),
			...(customConfig.baseConfig && {
				baseConfig: { ...config.baseConfig, ...customConfig.baseConfig },
			}),
			...(customConfig.paymentParams && {
				paymentParams: {
					...config.paymentParams,
					...customConfig.paymentParams,
				},
			}),
			...(customConfig.customParams && {
				customParams: { ...config.customParams, ...customConfig.customParams },
			}),
			...(customConfig.language && {
				language: XPay.LANGUAGE[customConfig.language],
			}),
		}),
	};
	return newConfig
}

export const validateXPay = (xpay: unknown): null | XPay => {
	if (xpay === null || isXPay(xpay)) {
		return xpay;
	}
	throw new Error(ERRORS.XPAY_NOT_VALID);
};

export type XPayProp =
	| { tag: "empty" }
	| { tag: "sync"; sdk: XPay }
	| { tag: "async"; sdkPromise: Promise<XPay | null> };

export interface XPayWrapperContextValue {
	sdk: XPay | null;
}

/**
 * Parses loaded XPay data from prop
 * XPay data can be:
 * - a `pending promise` (tag `async`)
 * - `null` (SSR, tag `empty`)
 * - an `object` (promise fulfilled, tag `sync`)
 **/
export const parseXPayProp = (raw: unknown): XPayProp => {
	if (isPromise(raw)) {
		return {
			tag: "async",
			sdkPromise: Promise.resolve(raw).then(validateXPay),
		};
	}

	const sdk = validateXPay(raw);

	if (sdk === null) {
		return { tag: "empty" };
	}

	return { tag: "sync", sdk };
};
