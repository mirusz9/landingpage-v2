'use client';
import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Lamp from './lamp/Lamp';
import Tile from './tile/Tile';

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
	const width = 30;
	const height = 50;

	// State to track individual lamp states
	const [lampStates, setLampStates] = useState<Record<string, 'on' | 'off'>>({});

	// State for random walk animation
	const [activeTiles, setActiveTiles] = useState<Set<string>>(new Set());
	const [fadingTiles, setFadingTiles] = useState<Set<string>>(new Set());
	const [walkerPosition, setWalkerPosition] = useState<{ x: number; y: number } | null>(null);
	const [isWalking, setIsWalking] = useState(false);
	const [walkStats, setWalkStats] = useState<{ steps: number; tilesLit: number }>({ steps: 0, tilesLit: 0 });

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
		(value) => `translate3d(0, calc(50% - ${value}px), 0) rotateX(90deg) translateY(-50%)`
	);

	// Define the 10x10 control area (centered)
	const controlAreaSize = 10;
	const controlStartX = 10;
	const controlStartY = 8;

	const isValidPosition = (x: number, y: number) => {
		return x >= 0 && x < width && y >= 0 && y < height;
	};

	const startRandomWalk = async () => {
		if (isWalking) return;

		setIsWalking(true);
		setActiveTiles(new Set());
		setFadingTiles(new Set());
		setWalkStats({ steps: 0, tilesLit: 0 });

		// Start from a random edge position
		const startPositions = [
			// { x: 0, y: Math.floor(Math.random() * height) }, // left edge
			// { x: width - 1, y: Math.floor(Math.random() * height) }, // right edge
			// { x: Math.floor(Math.random() * width), y: 0 }, // top edge
			{ x: Math.floor(Math.random() * width), y: height - 1 }, // bottom edge
		];

		let currentPos = startPositions[Math.floor(Math.random() * startPositions.length)];
		setWalkerPosition(currentPos);

		const visitedTiles = new Set<string>();
		const walkSpeed = 50; // milliseconds between steps
		const fadeDelay = 500; // delay before starting fade

		// Continue walking until we reach another edge or take too many steps
		let steps = 0;
		const maxSteps = Math.min(width * height, 100); // Prevent infinite loops

		while (steps < maxSteps) {
			// Light up current tile
			const tileKey = `${currentPos.y}-${currentPos.x}`;
			visitedTiles.add(tileKey);

			// Add to active tiles immediately
			setActiveTiles((prev) => new Set(prev).add(tileKey));
			setWalkStats({ steps: steps + 1, tilesLit: visitedTiles.size });

			// Schedule fade-out for this tile
			setTimeout(() => {
				startTileFade(tileKey);
			}, fadeDelay);

			await new Promise((resolve) => setTimeout(resolve, walkSpeed));

			// Check if we've reached another edge (excluding starting edge)
			const isAtEdge =
				currentPos.x === 0 || currentPos.x === width - 1 || currentPos.y === 0 || currentPos.y === height - 1;

			if (steps > 5 && isAtEdge) {
				// Reached an edge, complete the walk
				break;
			}

			// Get possible moves
			const possibleMoves = [];
			const directions = [
				// { x: 0, y: 1 }, // down
				{ x: 1, y: 0 }, // right
				{ x: 0, y: -1 }, // up
				{ x: 0, y: -1 }, // up
				{ x: 0, y: -1 }, // up
				{ x: 0, y: -1 }, // up
				{ x: -1, y: 0 }, // left
			];
			for (let i = 0; i < directions.length; i++) {
				const direction = directions[i];
				const newPos = {
					x: currentPos.x + direction.x,
					y: currentPos.y + direction.y,
				};

				if (isValidPosition(newPos.x, newPos.y) && !visitedTiles.has(`${newPos.y}-${newPos.x}`)) {
					possibleMoves.push(newPos);
				}
			}

			// If no valid moves, break
			if (possibleMoves.length === 0) break;

			// Choose a random valid move
			currentPos = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
			setWalkerPosition(currentPos);
			steps++;
		}

		// Remove walker after completing walk
		setTimeout(() => {
			setWalkerPosition(null);
			setIsWalking(false);
		}, 500);
	};

	// Function to start fade-out process for a tile
	const startTileFade = (tileKey: string) => {
		// Move from active to fading
		setActiveTiles((prev) => {
			const newSet = new Set(prev);
			newSet.delete(tileKey);
			return newSet;
		});
		setFadingTiles((prev) => new Set(prev).add(tileKey));

		// Remove from fading after fade duration
		setTimeout(() => {
			setFadingTiles((prev) => {
				const newSet = new Set(prev);
				newSet.delete(tileKey);
				return newSet;
			});
		}, 2000); // Match the 2s fade duration
	};

	const resetWalk = () => {
		setActiveTiles(new Set());
		setFadingTiles(new Set());
		setWalkerPosition(null);
		setIsWalking(false);
		setWalkStats({ steps: 0, tilesLit: 0 });
	};

	const getLampState = (rowIndex: number, columnIndex: number) => {
		const offsetX = 10;
		const offsetY = 10;
		const x = columnIndex - offsetX;
		const y = rowIndex - offsetY;
		// check for out of bounds
		if (x < 0 || x >= image[0].length || y < 0 || y >= image.length) {
			return 'off';
		}
		return image[y][x] === 1 ? 'on' : 'off';

		const lampKey = `${rowIndex}-${columnIndex}`;
		return lampStates[lampKey] || 'off';
	};

	const handleToggleControlArea = (newState: 'on' | 'off') => {
		const newLampStates: Record<string, 'on' | 'off'> = {};

		// Update all lamps in the 10x10 area
		for (let row = controlStartY; row < controlStartY + controlAreaSize; row++) {
			for (let col = controlStartX; col < controlStartX + controlAreaSize; col++) {
				const lampKey = `${row}-${col}`;
				newLampStates[lampKey] = newState;
			}
		}

		// Update states
		setLampStates((prev) => ({ ...prev, ...newLampStates }));
	};

	const getLamp = (rowIndex: number, columnIndex: number) => {
		const tileKey = `${rowIndex}-${columnIndex}`;
		const isLit = activeTiles.has(tileKey);
		const isFading = fadingTiles.has(tileKey);
		const isWalker = walkerPosition?.x === columnIndex && walkerPosition?.y === rowIndex;

		return <Tile key={tileKey} isLit={isLit} isWalker={isWalker} fadeOut={isFading} delay={0} />;
	};

	const getRows = () => {
		return Array.from({ length: height }, (_, index) => (
			<div key={index} className="flex flex-row flex-shrink-0 relative">
				{getColumns(index)}
			</div>
		));
	};

	const getColumns = (rowIndex: number) => {
		return Array.from({ length: width }, (_, index) => getLamp(rowIndex, index));
	};

	return (
		<>
			<div ref={scrollContainerRef} className="w-[100vw] h-[100vh] overflow-y-scroll relative">
				<div className="w-full h-[150%] relative bg-[#111]">
					<div
						className="w-full h-[150%] perspective-[800px] fixed top-0 left-0 pointer-events-none flex items-center justify-center"
						// style={{ perspectiveOrigin: `50% calc(50vh + ${scrollTop}px)` }}
						style={{ perspectiveOrigin: `50% 10vh` }}
					>
						<motion.div
							// className="absolute bottom-0 w-[300%] h-800 flex flex-col items-center justify-center border-5 border-blue-500 bg-[url('/tile.png')] bg-repeat bg-size-[42px]"
							className="absolute bottom-0  flex flex-col items-center justify-center"
							style={{
								transform: floorTransformY,
							}}
						>
							{getRows()}
						</motion.div>
					</div>
				</div>
				<div className="w-full h-250 relative z-20 bg-slate-950"></div>
			</div>
			{/* <div className="w-[100vw] h-[100vh] bg-gray-950 overflow-hidden flex ">
				<div className="border-0 border-blue-500 w-1/2"></div>
				<div
					className="perspective-[547px] border-0 border-red-500 w-1/2"
					style={{ transform: `translateX(${translateX}px) translateY(${translateY}px)` }}
				>
					<div className={`relative rotate-x-0 rotate-y-[-15deg]  translate-z-[0px]`}>
					<div
						className={`relative border-0 border-green-500 w-full h-full flex items-center justify-center`}
						style={{
							transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) translateX(${translateX2}px) translateY(${translateY2}px)`,
						}}
					>
						<div className="relative">
							<div className="relative border-0 border-yellow-500">{getRows()}</div>
							<div className="absolute z-5 top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-gray-950 via-transparent to-gray-950/50 via-65% pointer-events-none"></div>
							<div className="absolute z-5 top-0 left-0 right-0 bottom-0 bg-linear-[0deg,red_0%,blue_1%,teal_50%,blue_99%,yellow_100%]"></div>
						</div>
					</div>
				</div>
			</div> */}
			<div className="relative">
				<div className="fixed top-4 left-4 z-10 flex gap-4 flex-col">
					<div className="text-white text-sm mb-2">Random Walk Animation</div>
					<div className="flex gap-2 mb-4">
						<button
							onClick={startRandomWalk}
							disabled={isWalking}
							className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
						>
							{isWalking ? 'Walking...' : 'Start Walk'}
						</button>
						<button
							onClick={resetWalk}
							disabled={isWalking}
							className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
						>
							Reset
						</button>
					</div>
					<div className="text-white text-xs mb-4 bg-gray-800 p-2 rounded">
						<div>Steps: {walkStats.steps}</div>
						<div>Active Tiles: {activeTiles.size}</div>
						<div>Fading Tiles: {fadingTiles.size}</div>
						<div>Total Visited: {walkStats.tilesLit}</div>
						<div>
							Grid: {width} × {height}
						</div>
					</div>
					<div className="text-white text-sm mb-2">3D Transform Controls</div>
					<div className="flex flex-col gap-3">
						{/* Rotation Controls */}
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

						{/* Translation Controls */}
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
			</div>
		</>
	);
}
