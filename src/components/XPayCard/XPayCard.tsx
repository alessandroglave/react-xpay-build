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
	StyleSplittedI,
	XPayCardStyle,
} from "types";

export interface XPayCardProps {
	/** XPay Build card type. Defaults to `single` */
	cardType?: CardType | undefined;
	/** XPay Build style object **/
	style?: XPayCardStyle | null;
	/** React style object applied to wrapper div **/
	styleWrapper?: React.CSSProperties | null;
	/** React style object applied to wrapper divs **/
	styleSplitted?: StyleSplittedI;
	/** React components: splitted form labels */
	labelPan?: GenericReactComponent | null;
	labelExpiry?: GenericReactComponent | null;
	labelCVC?: GenericReactComponent | null;
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
			cardType = CardTypes.CARD,
			style = null,
			styleWrapper = null,
			styleErrors = null,
			showErrors = true,
			styleSplitted = null,
			labelPan = null,
			labelExpiry = null,
			labelCVC = null,
			cardErrorHandler = null,
		},
		ref
	) => {
		const [cardErrors, setCardErrors] = useState(null);
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
			const carddiv = createCardWrapper(style, cardType);
			cardRef.current = carddiv;
			if (cardType === CardTypes.CARD) {
				carddiv.mount("react-xpay-card");
			} else {
				carddiv.mount("react-xpay-pan", "react-xpay-expiry", "react-xpay-cvc");
			}
		}, [isMounted, XPayContext.initialConfig]);

		useEffect(() => {
			const onCardError = (e: any) => {
				console.log(e);
				if (cardErrorHandler) {
					if (showErrors) {
						setCardErrors((prev) => e.detail.errorMessage || null);
					}
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
				{cardType === CardTypes.SPLIT && (
					<div
						{...(styleSplitted?.wrapper && {
							style: styleSplitted.wrapper,
						})}
					>
						<div
							{...(styleSplitted?.pan?.wrapper && {
								style: styleSplitted.pan?.wrapper,
							})}
						>
							{labelPan && labelPan}
							<div
								id="react-xpay-pan"
								{...(styleSplitted?.pan?.input && {
									style: styleSplitted.pan?.input,
								})}
							></div>
						</div>
						<div
							{...(styleSplitted?.expiry?.wrapper && {
								style: styleSplitted.expiry?.wrapper,
							})}
						>
							{labelExpiry && labelExpiry}
							<div
								id="react-xpay-expiry"
								{...(styleSplitted?.expiry?.input && {
									style: styleSplitted.expiry?.input,
								})}
							></div>
						</div>
						<div
							{...(styleSplitted?.cvc?.wrapper && {
								style: styleSplitted.cvc?.wrapper,
							})}
						>
							{labelCVC && labelCVC}
							<div
								id="react-xpay-cvc"
								{...(styleSplitted?.cvc?.input && {
									style: styleSplitted.cvc?.input,
								})}
							/>
						</div>
					</div>
				)}
				{showErrors && cardErrors && (
					<div {...(styleErrors && { style: styleErrors })}>{cardErrors}</div>
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

const createCardWrapper = (style: XPayCardStyle | null, cardType: CardType) => {
	if (cardType === CardTypes.CARD) {
		return style
			? window.XPay.create(window.XPay.OPERATION_TYPES.CARD, style)
			: window.XPay.create(window.XPay.OPERATION_TYPES.CARD);
	}
	return style
		? window.XPay.create(window.XPay.OPERATION_TYPES.SPLIT_CARD, style)
		: window.XPay.create(window.XPay.OPERATION_TYPES.SPLIT_CARD);
};
