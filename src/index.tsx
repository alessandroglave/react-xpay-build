export * from "./components";
export * from "./loadSdk";
export * from "./types";

import { XPay } from "./types";

declare global {
	interface Window {
		XPay?: XPay;
	}
}
