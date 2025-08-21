'use client';
import { useState } from 'react';
import Lamp from './Lamp';

export default function LampPage() {
	const [isOn, setIsOn] = useState(false);
	const [hue, setHue] = useState(0);

	const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setHue(Number(e.target.value));
	};

	const handleToggle = () => {
		setIsOn(!isOn);
	};

	return (
		<div className="w-[100vw] h-[100vh] bg-gray-950 overflow-hidden flex items-center justify-center relative">
			<button
				onClick={handleToggle}
				className={`absolute top-4 left-4 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
					isOn ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'
				}`}
			>
				{isOn ? 'Turn Off' : 'Turn On'}
			</button>
			<div className="absolute top-18 left-4">
				<input type="range" min="0" max="360" value={hue} onChange={handleHueChange} />
			</div>
			<div className="mr-10 flex">
				<Lamp isOn={isOn} hue={hue} />
				<Lamp isOn={isOn} hue={hue} />
			</div>
		</div>
	);
}
