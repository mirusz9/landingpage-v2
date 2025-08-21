import { motion } from 'framer-motion';
import './Tile.css';

interface TileProps {
	isLit?: boolean;
	isWalker?: boolean;
	delay?: number;
	fadeOut?: boolean;
}

export default function Tile({ isLit = false, isWalker = false, delay = 0, fadeOut = false }: TileProps) {
	// Define different animation states
	const getAnimationState = () => {
		if (isWalker) {
			// Walker: bright red with scale
			return {
				backgroundColor: '#ff4444',
				scale: 1.1,
				boxShadow: '0 0 30px #ff4444, inset 0 0 20px #ff4444',
			};
		} else if (isLit && !fadeOut) {
			// Just stepped on: bright green, quick animation
			return {
				backgroundColor: '#00ff88',
				scale: 1.05,
				boxShadow: '0 0 25px #00ff88, inset 0 0 25px #00ff88',
			};
		} else if (fadeOut) {
			// Fading out: slow transition back to dark
			return {
				backgroundColor: '#333',
				scale: 1,
				boxShadow: 'none',
			};
		} else {
			// Default state
			return {
				backgroundColor: '#333',
				scale: 1,
				boxShadow: 'none',
			};
		}
	};

	// Define transition based on state
	const getTransition = () => {
		if (isWalker) {
			return { duration: 0.2 };
		} else if (isLit && !fadeOut) {
			return { duration: 0.1 };
		} else if (fadeOut) {
			return { duration: 2.0 };
		} else {
			return { duration: 0.3 };
		}
	};

	return (
		<motion.div
			className={`tile ${isLit ? 'lit' : ''} ${isWalker ? 'walker' : ''}`}
			initial={{
				backgroundColor: '#333',
				scale: 1,
				boxShadow: 'none',
			}}
			animate={getAnimationState()}
			transition={getTransition()}
		/>
	);
}
