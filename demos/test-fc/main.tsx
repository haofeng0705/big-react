import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState } from 'react';

function App() {
	const [num] = useState(100);
	return <div>{num}</div>;
}

// function Child() {
// 	return <span>big-react</span>;
// }

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<App />
);
