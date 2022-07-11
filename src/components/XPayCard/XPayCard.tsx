import { useXPay } from "components/XPayProvider";
import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { XPayCardStyle } from "types";

interface IProps {
	/** XPay Build style object **/
	style?: XPayCardStyle | null;
	/** Defaults `true`. Use `showError = false` to hide library errors. **/
	showErrors?: boolean;
	/** With `showError = false` you can pass a handler to set errors in your component **/
	cardErrorHandler?: (v: string) => void | null;
}

/**
 * @prop showErrors
 * @prop cardErrorHandler
 **/
export const XPayCard = forwardRef<unknown, IProps>(
	({ style = null, showErrors = true, cardErrorHandler = null }, ref) => {
		const cardErrors = useRef(null);
		const [isMounted, setIsMounted] = useState(false);
		const XPayContext = useXPay();
		const initRef = useRef(false);
		const cardRef = useRef(null);

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
			const carddiv = style ? window.XPay.create(window.XPay.OPERATION_TYPES.CARD, style) : window.XPay.create(window.XPay.OPERATION_TYPES.CARD);
			cardRef.current = carddiv;
			carddiv.mount("react-xpay-card");
		}, [isMounted, XPayContext.initialConfig]);

		useEffect(() => {
			const onCardError = (e: any) => {
				console.log(e);
				if (cardErrorHandler) {
					cardErrors.current = e.detail.errorMessage || null;
					cardErrorHandler(e.detail.errorMessage || null);
				}
			};

			window.addEventListener("XPay_Card_Error", onCardError);
			return () => {
				window.removeEventListener("XPay_Card_Error", onCardError);
			};
		}, []);

		const createNonce = () => {
			window.XPay.createNonce("payment-form", cardRef.current);
		};

		useImperativeHandle(ref, () => ({ createNonce }), []);

		return (
			<>
				<div id="react-xpay-card" ref={cardRef}></div>
				{showErrors && cardErrors && cardErrors?.current && (
					<div>{cardErrors.current}</div>
				)}
			</>
		);
	}
);

export const useCard = () => {
	return {
		pay: (cardRef: any) => cardRef.current.createNonce(),
	};
};
