import { motion } from 'framer-motion';
import './Tile.css';

interface TileProps {
	animationDelay?: number;
}

export default function Tile({ animationDelay = 0 }: TileProps) {
	return <div className={`tile`} style={{ animationDelay: `${animationDelay}ms`, transform: `scaleY(${1 - animationDelay / 600})` }}></div>;
}
