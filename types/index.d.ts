import { XPay } from "../src/types";

export {};

declare global {
	interface Window {
		XPay?: XPay;
	}
}
