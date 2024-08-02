import { Metric } from 'web-vitals';

// Define the type for the callback function
type OnPerfEntry = (metric: Metric) => void;

const reportWebVitals = (onPerfEntry?: OnPerfEntry) => {
	if (onPerfEntry && typeof onPerfEntry === 'function') {
		import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
			getCLS(onPerfEntry);
			getFID(onPerfEntry);
			getFCP(onPerfEntry);
			getLCP(onPerfEntry);
			getTTFB(onPerfEntry);
		});
	}
};

export default reportWebVitals;
