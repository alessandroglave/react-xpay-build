export * from "./components";
export * from "./loadSdk";

import { XPay } from "./types";

declare global {
	interface Window {
		XPay?: XPay;
	}
}
