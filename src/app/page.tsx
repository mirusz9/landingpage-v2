'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Tile from './tile/Tile';
import './page.css';

const image = [
	[1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
	[1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
	[1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
	[1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1],
	[1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
	[1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
	[1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
	[1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
];

export default function Home() {
	const width = 34;
	const height = 20;

	// State for flash animations
	const [flashingColumns, setFlashingColumns] = useState<Set<number>>(new Set());
	const flashingColumnsTimeoutRef = useRef<Set<number>>(new Set());

	// State for 3D transforms
	const [rotateX, setRotateX] = useState(0);
	const [rotateY, setRotateY] = useState(0);
	const [rotateZ, setRotateZ] = useState(0);
	const [translateX, setTranslateX] = useState(0);
	const [translateY, setTranslateY] = useState(0);
	const [translateX2, setTranslateX2] = useState(0);
	const [translateY2, setTranslateY2] = useState(0);

	// Scroll container ref for Motion
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// Use Framer Motion's optimized scroll tracking
	const { scrollY } = useScroll({
		container: scrollContainerRef,
	});

	// Create optimized transform values based on scroll
	// Using transform3d for hardware acceleration
	const floorTransformY = useTransform(
		scrollY,
		(value) => `translateY(calc(50% - ${value}px)) rotateX(90deg) translateY(-50%)`
	);

	const titleTransformY = useTransform(scrollY, (value) => `translateZ(-2500px) translateY(${-value + 100}px)`);

	// useEffect(() => {
	// 	const interval = setInterval(() => {
	// 		flashRandomColumn();
	// 	}, 100);
	// 	return () => clearInterval(interval);
	// }, []);

	const flashRandomColumn = () => {
		let randomColumn = Math.floor(Math.random() * width);
		let tries = 0;
		while (flashingColumnsTimeoutRef.current.has(randomColumn)) {
			randomColumn = Math.floor(Math.random() * width);
			tries++;
			if (tries > 5) {
				return;
			}
		}
		flashColumn(randomColumn);
	};

	const flashColumn = (columnIndex: number) => {
		// Add the column to flashing set
		setFlashingColumns((prev) => new Set(prev).add(columnIndex));
		flashingColumnsTimeoutRef.current.add(columnIndex);

		// Remove it after animation completes (2 seconds)
		setTimeout(() => {
			setFlashingColumns((prev) => {
				const newSet = new Set(prev);
				newSet.delete(columnIndex);
				return newSet;
			});
		}, 1000);

		setTimeout(() => {
			flashingColumnsTimeoutRef.current.delete(columnIndex);
		}, 1100);
	};

	const getTile = (rowIndex: number, columnIndex: number) => {
		const tileKey = `${rowIndex}-${columnIndex}`;

		return <Tile key={tileKey} animationDelay={rowIndex * 5} />;
	};

	const getTileGrid = () => {
		return Array.from({ length: width }, (_, index) => getColumn(index));
	};

	const getColumn = (columnIndex: number) => {
		const isFlashing = flashingColumns.has(columnIndex);
		return (
			<div
				className={`column column-${columnIndex} ${
					isFlashing ? 'flash-purple' : ''
				} flex flex-col-reverse flex-shrink-0 relative`}
				key={columnIndex}
			>
				{Array.from({ length: height }, (_, index) => getTile(index, columnIndex))}
			</div>
		);
	};

	return (
		<>
			<div ref={scrollContainerRef} className="w-[100vw] h-[100vh] overflow-y-scroll relative">
				<div className="w-full h-[150%] relative bg-[var(--scene-sky-col)]">
					<div
						className="w-full h-[150%] perspective-[1000px] fixed top-0 left-0 pointer-events-none flex items-center justify-center"
						// style={{ perspectiveOrigin: `50% calc(50vh + ${scrollTop}px)` }}
						style={{ perspectiveOrigin: `50% 10vh` }}
					>
						<motion.div
							// className="absolute bottom-0 w-[300%] h-800 flex flex-col items-center justify-center border-5 border-blue-500 bg-[url('/tile.png')] bg-repeat bg-size-[42px]"
							className="absolute bottom-0  flex items-center justify-center bg-[var(--scene-tile-border-col)]"
							style={{
								transform: floorTransformY,
							}}
						>
							{getTileGrid()}
							<div className="absolute top-[-10px] left-[-10px] bottom-[-10px] right-[-10px] gridGradient z-20"></div>
						</motion.div>
						<motion.div
							className="absolute top-0 left-0 w-full h-full  text-[400px] flex items-center justify-center z-21 transform-3d"
							style={{
								transform: titleTransformY,
							}}
						>
							<div className="absolute translate-z-[-120px] text-gray-400">
								<h1>mirusz</h1>
							</div>
							<div className="absolute translate-z-[-100px] text-gray-400">
								<h1>mirusz</h1>
							</div>
							<div className="absolute translate-z-[-80px] text-gray-400">
								<h1>mirusz</h1>
							</div>
							<div className="absolute translate-z-[-60px] text-gray-400">
								<h1>mirusz</h1>
							</div>
							<div className="absolute translate-z-[-40px] text-gray-400">
								<h1>mirusz</h1>
							</div>
							<div className="absolute translate-z-[-20px] text-gray-400">
								<h1>mirusz</h1>
							</div>
							<div className="absolute translate-z-0">
								<h1>mirusz</h1>
							</div>
						</motion.div>
					</div>
				</div>
				<div className="w-full h-250 relative z-20 bg-slate-950"></div>
			</div>
			{/* <div className="relative">
				<div className="fixed top-4 left-4 z-10 flex gap-4 flex-col">
					<div className="text-white text-sm mb-2">Random Walk Animation</div>
					<div className="flex gap-2 mb-4">
						<button
							onClick={flashRandomColumn}
							className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
						>
							Flash
						</button>
					</div>
					<div className="flex flex-col gap-3">
						<div className="flex flex-col gap-2">
							<div className="text-white text-xs">Rotation</div>
							<div className="flex flex-col gap-1">
								<div className="flex items-center gap-2">
									<label className="text-white text-xs w-16">Rotate X:</label>
									<input
										type="range"
										min="-180"
										max="180"
										value={rotateX}
										onChange={(e) => setRotateX(Number(e.target.value))}
										className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
									/>
									<span className="text-white text-xs w-12">{rotateX}°</span>
								</div>
								<div className="flex items-center gap-2">
									<label className="text-white text-xs w-16">Rotate Y:</label>
									<input
										type="range"
										min="-180"
										max="180"
										value={rotateY}
										onChange={(e) => setRotateY(Number(e.target.value))}
										className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
									/>
									<span className="text-white text-xs w-12">{rotateY}°</span>
								</div>
								<div className="flex items-center gap-2">
									<label className="text-white text-xs w-16">Rotate Z:</label>
									<input
										type="range"
										min="-180"
										max="180"
										value={rotateZ}
										onChange={(e) => setRotateZ(Number(e.target.value))}
										className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
									/>
									<span className="text-white text-xs w-12">{rotateZ}°</span>
								</div>
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<div className="text-white text-xs">Translation</div>
							<div className="flex flex-col gap-1">
								<div className="flex items-center gap-2">
									<label className="text-white text-xs w-16">Translate X:</label>
									<input
										type="range"
										min="-200"
										max="200"
										value={translateX}
										onChange={(e) => setTranslateX(Number(e.target.value))}
										className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
									/>
									<span className="text-white text-xs w-12">{translateX}px</span>
								</div>
								<div className="flex items-center gap-2">
									<label className="text-white text-xs w-16">Translate Y:</label>
									<input
										type="range"
										min="-200"
										max="200"
										value={translateY}
										onChange={(e) => setTranslateY(Number(e.target.value))}
										className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
									/>
									<span className="text-white text-xs w-12">{translateY}px</span>
								</div>
								<div className="flex items-center gap-2">
									<label className="text-white text-xs w-16">Translate X2:</label>
									<input
										type="range"
										min="-200"
										max="200"
										value={translateX2}
										onChange={(e) => setTranslateX2(Number(e.target.value))}
										className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
									/>
									<span className="text-white text-xs w-12">{translateX2}px</span>
								</div>
								<div className="flex items-center gap-2">
									<label className="text-white text-xs w-16">Translate Y2:</label>
									<input
										type="range"
										min="-200"
										max="200"
										value={translateY2}
										onChange={(e) => setTranslateY2(Number(e.target.value))}
										className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
									/>
									<span className="text-white text-xs w-12">{translateY2}px</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div> */}
		</>
	);
}
