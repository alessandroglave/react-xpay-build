# React XPay Build

React library for [Nexi's XPay Build](https://ecommerce.nexi.it/specifiche-tecniche/build/introduzione.html)

## Requirements

The minimum supported version of React is v16.8.
If you use an older version you need to upgrade React to use this library.

## Documentation

- [XPay Build](https://ecommerce.nexi.it/specifiche-tecniche/build/introduzione.html)

## Library usage example

- Import XPay's sdk script with `loadSdk` helper. Use `isProduction = false` to load the test environment.
- Use XPayProvider component passing the formatted order obtained from your backend integration [Documentation](https://ecommerce.nexi.it/specifiche-tecniche/build/pagamento.html)
- Pass a nonceHandler function to the provider to handle card payments. It's called at the custom event `XPay_Nonce`.

```jsx
import React from "react";
import { loadXPay, XPayProvider } from "react-xpay-build";

const sdkLoader = loadXPay({
	alias: "YOUR_ALIAS",
	isProduction: false,
});

const App = () => {
	const nonceHandler = (_nonceResp) => {
		// submit nonce response data to your backend
		// to pay with the server-to-server integration
	};
	return (
		<XPayProvider
			sdk={sdkLoader}
			apiKey="YOUR_ALIAS"
			order={order}
			nonceHandler={nonceHandler}
		>
			<YourCheckoutComponent />
		</XPayProvider>
	);
};
```

### Pay with card

- In your checkout component you can use the `XPayCard` component to show XPay's card input.

- To pay you can use the use `yourCardRef.current.createNonce()` or the helper `pay` function from `useCard`  
  **You need to pass a ref to the XPayCard component**

```jsx
import { XPayCard, useCard } from "react-xpay-build";

const YourCheckoutComponent = () => {
	const cardRef = useRef(null);

	const handlePayWithComponent = () => {
		cardRef.current.createNonce();
	};

	const { pay } = useCard();
	const handlePayWithHelperFx = useCallback(() => {
		pay(cardRef);
	}, [cardRef]);

	return (
		<>
			<XPayCard ref={cardRef} />
			<button onClick={handlePayWithHelperFx}>Pay</button>
			<button onClick={handlePayWithComponent}>Or use this Pay button</button>
		</>
	);
};
```

### Pay with Alternate Payment Methods (APM)

- In your `XPayProvider` you need to pass a `paymentResultHandler` [documentation](https://ecommerce.nexi.it/specifiche-tecniche/build/metodidipagamentoalternativi.html) callback function, it will be called at `XPay_Payment_Result` XPay's custom event.
- In your checkout component (inside XPayProvider) you can use `<XPayAPM />` component to pay with [alternate payment methods](https://ecommerce.nexi.it/specifiche-tecniche/build/metodidipagamentoalternativi.html)
- You can choose which APM buttons to show passing a single payment method or a payment methods array to the APM component

```jsx
const App = () => {
	return (
		<XPayProvider
			sdk={sdkLoader}
			apiKey="YOUR_ALIAS"
			order={order}
			paymentResultHandler={paymentResultHandler}
		>
			<YourCheckoutComponent />
		</XPayProvider>
	);
};
```

- Pay with all available payment methods

```jsx
import { XPayAPM } from "react-xpay-build";

const YourCheckoutComponent = () => {
	return <XPayAPM />;
};
```

- Show only APM buttons in the selected array

```jsx
import { XPayAPM } from "react-xpay-build";

const YourCheckoutComponent = () => {
	return <XPayAPM paymentMethodName={["SATISPAY", "PAYPAL"]} />;
};
```

- Pick your selected APM buttons (e.g. to show them in different page sections)

```jsx
import { XPayAPM } from "react-xpay-build";

const YourCheckoutComponent = () => {
	return (
		<>
			<div style={{ paddingBottom: "20px" }}>
				<XPayAPM paymentMethodName="PAYPAL" />
			</div>
			<XPayAPM paymentMethodName="AMAZONPAY" />
			<XPayAPM paymentMethodName="SATISPAY" />
		</>
	);
};
```

## Recurring Payments & Custom configs

You can pass a customConfig object to XPayProvider to handle [recurring payments](https://ecommerce.nexi.it/specifiche-tecniche/build/pagamentoricorrente.html) and other custom parameters.
All parameters in the customConfig will be added to the library config object.
Properties into the `main` object will be appended to tha main config object.

```jsx
const customConfig = {
	main: {
		requestType: "AN",
		serviceType: "AN",
	},
	baseConfig: {},
	paymentParams: {},
	customParams: {
		num_contratto: "123",
	},
	language: "ITA",
};

const App = () => {
	return (
		<XPayProvider
			sdk={sdkLoader}
			apiKey="YOUR_ALIAS"
			order={order}
			paymentResultHandler={paymentResultHandler}
			customConfig={customConfig}
		>
			<YourCheckoutComponent />
		</XPayProvider>
	);
};
```
