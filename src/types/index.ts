export type XPay = any;

export interface NexiEvent extends Event {
	[key: string]: any;
}

export interface XPaySdkParams {
	alias: string;
	isProduction: boolean;
	url?: string;
}

export type LoadXPay = (args: XPaySdkParams) => Promise<XPay | null>;

export type SetLoadParams = (args: XPaySdkParams) => void;

export enum IntegrationType {
	PRODUCTION = "PRODUCTION",
	TEST = "TEST",
}

export enum NexiUrl {
	PRODUCTION = "https://ecommerce.nexi.it/ecomm/XPayBuild/js",
	TEST = "https://int-ecommerce.nexi.it/ecomm/XPayBuild/js",
}

export enum ERRORS {
	SCRIPT_EXISTS = "script already expists",
	SCRIPT_INJECT = "Cannot inject Nexi script in HTML document",
	FAILED_TO_LOAD = "Failed to load XPay SDK",
	SDK_NOT_AVAILABLE = "XPay's sdk is not available",
	XPAY_NOT_VALID = "XPay object is not valid",
	PROVIDER_PROPS_CHANGED = "Unsupported prop change on XPayProvider. You cannot change its props after setting them",
	USE_XPAY_PROVIDER = "Error, useXPay must be used in a component wrapped in XPayProvider",
	MISSING_NONCE_HANDLER = "onNonceEvent fired but custom handler is missing",
	MISSING_PAYMENT_RESULT_HANDLER = "PaymentResult fired but custom handler is missing",
}

export enum Languages {
	ITA = "ITA",
	ENG = "ENG",
	SPA = "SPA",
	FRA = "FRA",
	GER = "GER",
	JPN = "JPN",
	CHI = "CHI",
	ARA = "ARA",
	RUS = "RUS",
	POR = "POR",
}

export type PaymentMethod =
	| "APPLEPAY"
	| "AMAZONPAY"
	| "MYBANK"
	| "ALIPAY"
	| "WECHATPAY"
	| "GIROPAY"
	| "IDEAL"
	| "EPS"
	| "BCMC"
	| "P24"
	| "GOOGLEPAY"
	| "PAYPAL"
	| "SATISPAY";

export interface OrderI {
	amount: number | string;
	transactionId: string;
	currency: number | string;
	timeStamp: number;
	mac: string;
	url?: string;
	urlPost?: string;
	urlBack?: string;
	requestType?: string;
	serviceType?: string;
	num_contratto?: number | string;
}

export interface OrderInterface extends OrderI, GenericObject {}

export interface XPayProviderI {
	sdk: any;
	order: OrderInterface;
	apiKey: string;
	nonceHandler?: any;
	paymentResultHandler?: any;
	customConfig?: CustomConfigI | null;
	secure?: boolean;
	children?: any;
}

export interface GenericObject {
	[key: string]: any;
}
export interface CustomConfigI {
	main?: GenericObject;
	baseConfig?: GenericObject;
	paymentParams?: GenericObject;
	customParams?: GenericObject;
	language?: Languages;
}

export interface XPayCardStyle {
	common?: XPayCardAvailableStyles,
	correct?: XPayCardAvailableStyles,
	error?: XPayCardAvailableStyles,
}

export interface XPayCardAvailableStyles {
	fontFamily?: string,
	fontSize?: string | number,
	fontStyle?: string,
	letterSpacing?: string | number,
	"::placeholder"?: {
		color?: string | number
	},
	color?: string | number
}

export enum CardTypes {
	CARD = 'card',
	SPLIT = 'split'
}
