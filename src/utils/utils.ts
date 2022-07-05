import { XPay } from "../types";

export const isPromise = (raw: unknown): raw is PromiseLike<unknown> => {
	return isUnknownObject(raw) && typeof raw.then === "function";
};
export const isUnknownObject = (
	raw: unknown
): raw is { [key in PropertyKey]: unknown } => {
	return raw !== null && typeof raw === "object";
};

/**
 * Checks if object is a valid XPay object, checking its `createNonce` property
**/
export const isXPay = (x: unknown): x is XPay => {
	return (
		x !== null &&
		typeof x === "object" &&
		Object.prototype.hasOwnProperty.call(x, "createNonce")
	);
};
