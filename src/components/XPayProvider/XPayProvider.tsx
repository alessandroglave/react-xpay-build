import React, {
	useEffect,
	useState,
	createContext,
	useContext,
} from "react";
import { Environments, ERRORS, NexiEvent, XPay, XPayProviderI } from "../../types";
import { usePrevious } from "utils/usePrevious";
import { buildConfig, parseXPayProp, XPayWrapperContextValue } from "./utils";

export const XPayContext = createContext<any>(null);

export const XPayProvider = ({
	sdk,
	order,
	apiKey,
	env = Environments.TEST,
	xpayReadyHandler,
	paymentStartedHandler,
	nonceHandler,
	paymentResultHandler,
	customConfig = null,
	secure = true,
	children,
}: XPayProviderI) => {
	const parsed = parseXPayProp(sdk);

	const [ctx, setContext] = useState<XPayWrapperContextValue>(() => ({
		sdk: parsed.tag === "sync" ? parsed.sdk : null,
	}));

	const [initialConfig, setInitialConfig] = useState(false);

	useEffect(() => {
		let isMounted = true;
		const updateCtx = (sdk: XPay) => {
			setContext((ctx) => {
				if (ctx.sdk) return ctx;
				return {
					sdk,
				};
			});
		};
		// handle `sdk promise`
		if (parsed.tag === "async" && !ctx.sdk) {
			parsed.sdkPromise.then((s) => {
				if (sdk && isMounted) {
					updateCtx(s);
				}
			});
		} else if (parsed.tag === "sync" && !ctx.sdk) {
			// handle transiction from `sdk null` to `object` (fulfilledPromise)
			updateCtx(parsed.sdk);
		}
		return () => {
			isMounted = false;
		};
	}, [parsed]);

	/**
	 * Init XPay Build SDK and set payment config
	**/
	useEffect(() => {
		if (!ctx.sdk) {
			return;
		}

		const XPay = window.XPay;
		if (!XPay) {
			return;
		}

		// init sdk
		XPay.init();
		const config = buildConfig(apiKey, env, order, XPay, customConfig);
		XPay.setConfig(config);
		
		/** 
		 * Sets initialConfig to true
		 * Other components will mount nexi's iframes on DOM only
		 * if this flag is true
		**/ 
		setInitialConfig(true);

		// Handle 3D secure
		if (secure) {
			XPay.setInformazioniSicurezza({});
		}
		return () => {
			setInitialConfig(false);
		};
	}, [ctx.sdk]);

	/**
	 * Detect props changes
	**/
	const prevXPay = usePrevious(sdk);
	useEffect(() => {
		if (prevXPay !== null && prevXPay !== sdk) {
			console.warn(ERRORS.PROVIDER_PROPS_CHANGED)
		}
	}, [prevXPay, sdk]);

	/**
	 * Set event listeners with custom callbacks, if provided
	**/
	useEffect(() => {
		// library ready
		const onXPayReady = (e: NexiEvent) => {
			if(xpayReadyHandler) {
				return xpayReadyHandler(e)
			}
			console.log(`XPay Build sdk ready:`, e)
		};

		// detects click on APM
		const onPaymentStartedHandler = (e: NexiEvent) => {
			if(paymentStartedHandler) {
				return paymentStartedHandler(e)
			}
			console.log(`PaymentStarted:`, e)
		};
		// card
		const onNonceEvent = (e: NexiEvent) => {
			if(!nonceHandler) {
				console.warn(`${ERRORS.MISSING_NONCE_HANDLER}`,e.detail)
				return;
			}
			return nonceHandler(e.detail)
		};

		// detects apm results (e.detail.tipoTransazione === 'PAYPAL')
		const onPaymentResult = (e: NexiEvent) => {
			if(!paymentResultHandler) {
				console.log(`${ERRORS.MISSING_PAYMENT_RESULT_HANDLER}`,e.detail)
				return;
			}
			return paymentResultHandler(e.detail)
    }


		window.addEventListener("XPay_Ready", onXPayReady);
		window.addEventListener("XPay_Nonce", onNonceEvent);
		window.addEventListener("XPay_Payment_Started", onPaymentStartedHandler);
		window.addEventListener("XPay_Payment_Result", onPaymentResult);
		return () => {
			window.removeEventListener("XPay_Ready", onXPayReady);
			window.removeEventListener("XPay_Nonce", onNonceEvent);
			window.removeEventListener("XPay_Payment_Started", onPaymentStartedHandler);
			window.removeEventListener("XPay_Payment_Result", onPaymentResult);
		};
	}, []);

	return (
		<XPayContext.Provider value={{ ctx, initialConfig }}>
			{children}
		</XPayContext.Provider>
	);
};
XPayProvider.displayName = "XPayProvider";

/**
 * Hooks
**/
export const useXPay = (): XPay | null => {
	const ctx = useContext(XPayContext);
	if (!ctx) {
		console.warn(ERRORS.USE_XPAY_PROVIDER);
		return false;
	}
	return ctx;
};
