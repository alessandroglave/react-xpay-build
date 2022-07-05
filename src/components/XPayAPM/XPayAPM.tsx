import { useXPay } from "components/XPayProvider";
import React, { useEffect, useRef, useState } from "react";
import { PaymentMethod } from "../../types";

export interface PaymentMethodI {
	/** optional. A single payment method or and array of payment methods */
	paymentMethodName?: PaymentMethod | PaymentMethod[];
	style?: string;
}

export const XPayAPM = ({
	paymentMethodName = undefined,
	style = "",
}: PaymentMethodI) => {
	const [isMounted, setIsMounted] = useState(false);
	const initRef = useRef(false);
	const XPayContext = useXPay();

	useEffect(() => {
		if (!isMounted) {
			setIsMounted(true);
		}
		return () => setIsMounted(false);
	}, []);

	useEffect(() => {
		if (
			!isMounted ||
			!window.XPay ||
			!XPayContext.initialConfig ||
			!initRef ||
			!!initRef?.current
		) {
			return;
		}

		initRef.current = true;
		const btn = window.XPay.create(
			window.XPay.OPERATION_TYPES.PAYMENT_BUTTON,
			getNexiPaymentMethods(paymentMethodName)
		);
		btn.mount(getDivName(paymentMethodName));
	}, [isMounted, XPayContext.initialConfig]);

	return <div id={getDivName(paymentMethodName)} />;
};

function getNexiPaymentMethods(
	n?: undefined | PaymentMethod | PaymentMethod[]
) {
	return n ? (Array.isArray(n) ? n : [n]) : [];
}
function getDivName(n?: undefined | PaymentMethod | PaymentMethod[]) {
	return `react-XPay-${n ? (Array.isArray(n) ? n.join("--") : n) : "APMS"}`;
}
