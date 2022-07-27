import { loadXPay, XPayProvider } from "react-xpay-build";
import Consumer from "./Consumer";

// load Nexi's sdk
const sdkLoader = loadXPay({
	alias, 
	isProduction: false
});

const App = () => {

	const xpayReadyHandler = (e) => { console.log(e); }
	const paymentStartedHandler = (e) => { console.log(e); }
	return (
		<div>
			<XPayProvider
				sdk={sdkLoader}
				order={order}
				apiKey={alias}
				xpayReadyHandler={xpayReadyHandler}
				paymentStartedHandler={paymentStartedHandler}
				nonceHandler={nonceHandler}
				paymentResultHandler={paymentResultHandler}
				customConfig={customConfig}
			>
				<Consumer />
			</XPayProvider>
		</div>
	);
};

export default App;


const customConfig = {
	main: {
		requestType: 'AN',
		serviceType: 'AN'
	},
	baseConfig: {
		
	},
	paymentParams: {},
	customParams: {},
	language: 'ITA',
}


/**
 * constants
 **/
// alias / apiKey
const alias = "ALIAS_WEB_00058486";

// ordine restituito dal backend
const order = {
	amount: 10000,
	transactionId: "codice_1656931440",
	currency: 978,
	timeStamp: 1656931440000,
	mac: "a267d620b7259bd1b583a462e022f6ef9225da96",
	url: "http://localhost:3020/url",
	urlPost: "http://localhost:3020/urlPost",
	urlBack: "http://localhost:3020/urlBack",
};

// callback called when onNonceEvent is fired with response data
const nonceHandler = (_respData) => {
	console.log("onNonceEvent fired, resp: ", _respData);
};
// callback called when onPaymentResult is fired
const paymentResultHandler = (_detail) => {
	console.log("onPaymentResult fired, detail: ", _detail);
};
