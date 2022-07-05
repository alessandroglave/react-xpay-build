import { XPay } from "./types";

declare global {
	interface Window {
		XPay?: XPay;
	}
}
