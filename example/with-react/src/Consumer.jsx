import { useCallback, useState } from "react";
import { useEffect, useRef, useMemo } from "react";
import { XPayCard, XPayAPM, useCard, useXPay } from "react-xpay-build";

const Consumer = () => {
	const cardRef = useRef(null);
	const [ error, setError ] = useState(null)
	const { pay } = useCard();

	console.log('>>> error:',error)

	const handlePay = useCallback(() => {
		pay(cardRef);
	}, [cardRef]);

	const handlePayWithComponent = () => {
		cardRef.current.createNonce();
	};

	return (
		<>
			<XPayCard ref={cardRef} cardErrorHandler={setError} />
			<XPayAPM />
			{/* <XPayAPM paymentMethodName={["SATISPAY","PAYPAL"]} />
			<XPayAPM paymentMethodName="GOOGLE" />
			<XPayAPM paymentMethodName="PAYPAL" />
			<XPayAPM paymentMethodName="SATISPAY" /> */}
			<button onClick={handlePay}>PAY</button>
			<button onClick={handlePayWithComponent}>PAY with component (useImperativeHandle)</button>
		</>
	);
};

export default Consumer;
