import { useXPay } from "components/XPayProvider";
import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import {
	CardType,
	CardTypes,
	GenericReactComponent,
	XPayCardStyle,
} from "types";

export interface XPayCardProps {
	/** XPay Build card type. Defaults to `single` */
	type?: CardType | undefined;
	/** XPay Build style object **/
	style?: XPayCardStyle | null;
	/** React style object applied to wrapper div **/
	styleWrapper?: React.CSSProperties | null;
	/** React style object applied to wrapper divs **/
	styleSplitted?: {
		pan: React.CSSProperties | null;
		expiry: React.CSSProperties | null;
		ccv: React.CSSProperties | null;
	};
	/** React components: splitted form labels */
	labelPan?: GenericReactComponent | null;
	labelExpiry?: GenericReactComponent | null;
	labelCCV?: GenericReactComponent | null;
	/** React style object applied to errors div **/
	styleErrors?: React.CSSProperties | null;
	/** Defaults `true`. Use `showError = false` to hide library errors. **/
	showErrors?: boolean;
	/** With `showError = false` you can pass a handler to set errors in your component **/
	cardErrorHandler?: (v: string) => void | null;
}

/**
 * @prop showErrors
 * @prop cardErrorHandler
 **/
export const XPayCard = forwardRef<unknown, XPayCardProps>(
	(
		{
			type = CardTypes.CARD,
			style = null,
			styleWrapper = null,
			styleErrors = null,
			showErrors = true,
			styleSplitted = null,
			labelPan = null,
			labelExpiry = null,
			labelCCV = null,
			cardErrorHandler = null,
		},
		ref
	) => {
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
			const carddiv = createCardWrapper(style, type);
			cardRef.current = carddiv;
			if (type === CardTypes.CARD) {
				carddiv.mount("react-xpay-card");
			} else {
				carddiv.mount("react-xpay-pan", "react-xpay-expiry", "react-xpay-ccv");
			}
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
			<div>
				<div
					id="react-xpay-card"
					ref={cardRef}
					{...(styleWrapper && { style: styleWrapper })}
				></div>
				{type === CardTypes.SPLIT && (
					<div>
						{labelPan && labelPan}
						<div
							id="react-xpay-pan"
							{...(styleSplitted?.pan && {
								style: styleSplitted.pan,
							})}
						></div>
						{labelExpiry && labelExpiry}
						<div
							id="react-xpay-expiry"
							{...(styleSplitted?.expiry && {
								style: styleSplitted.expiry,
							})}
						></div>
						{labelCCV && labelCCV}
						<div
							id="react-xpay-ccv"
							{...(styleSplitted?.ccv && {
								style: styleSplitted.ccv,
							})}
						></div>
					</div>
				)}
				{showErrors && cardErrors && cardErrors?.current && (
					<div {...(styleErrors && { style: styleErrors })}>
						{cardErrors.current}
					</div>
				)}
			</div>
		);
	}
);

export const useCard = () => {
	return {
		pay: (cardRef: any) => cardRef.current.createNonce(),
	};
};

const createCardWrapper = (style: XPayCardStyle | null, type: CardType) => {
	if (type === CardTypes.CARD) {
		return style
			? window.XPay.create(window.XPay.OPERATION_TYPES.CARD, style)
			: window.XPay.create(window.XPay.OPERATION_TYPES.CARD);
	}
	return style
		? window.XPay.create(window.XPay.OPERATION_TYPES.SPLIT_CARD, style)
		: window.XPay.create(window.XPay.OPERATION_TYPES.SPLIT_CARD);
};
