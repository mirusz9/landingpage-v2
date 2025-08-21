import React, { useEffect, useState } from 'react';
import './Lamp.css';

interface LampProps {
	isOn?: boolean;
	hue?: number;
	animate?: boolean;
}

export default function Lamp({ isOn = false, hue = 0, animate = false }: LampProps) {
	const [isAnimating, setIsAnimating] = useState(false);
	const [animationType, setAnimationType] = useState<'turning-on' | 'turning-off' | null>(null);
	const [prevIsOn, setPrevIsOn] = useState(isOn);

	useEffect(() => {
		if (animate && prevIsOn !== isOn) {
			setIsAnimating(true);
			setAnimationType(isOn ? 'turning-on' : 'turning-off');

			// Reset animation after it completes
			const timeout = setTimeout(() => {
				setIsAnimating(false);
				setAnimationType(null);
			}, 500); // Match CSS animation duration

			return () => clearTimeout(timeout);
		}
		setPrevIsOn(isOn);
	}, [isOn, animate, prevIsOn]);

	const lampClasses = [
		'lamp',
		isOn ? 'lamp-on' : 'lamp-off',
		animate && isAnimating && animationType ? `lamp-${animationType}` : '',
	]
		.filter(Boolean)
		.join(' ');

	return (
		<div className={lampClasses} style={{ '--lamp-hue': `${hue}` } as React.CSSProperties}>
			<div className="lamp-shadow"></div>
			<div className="lamp-inner"></div>
		</div>
	);
}
