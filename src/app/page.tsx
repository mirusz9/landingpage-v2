'use client';
import { useState } from 'react';
import Lamp from './lamp/Lamp';

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
	const width = 80;
	const height = 50;

	// State to track individual lamp states
	const [lampStates, setLampStates] = useState<Record<string, 'on' | 'off'>>({});

	// State for 3D transforms
	const [rotateX, setRotateX] = useState(0);
	const [rotateY, setRotateY] = useState(0);
	const [rotateZ, setRotateZ] = useState(0);
	const [translateX, setTranslateX] = useState(0);
	const [translateY, setTranslateY] = useState(0);
	const [translateX2, setTranslateX2] = useState(0);
	const [translateY2, setTranslateY2] = useState(0);

	// Define the 10x10 control area (centered)
	const controlAreaSize = 10;
	const controlStartX = 10;
	const controlStartY = 8;

	const getLampState = (rowIndex: number, columnIndex: number) => {
		const offsetX = 30;
		const offsetY = 23;
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
		const lampState = getLampState(rowIndex, columnIndex);

		// Generate a hue based on position for variety
		// const hue = ((rowIndex * width + columnIndex) * 7) % 360;
		// const hue = 200;
		const hue = 200;

		return <Lamp isOn={lampState === 'on'} hue={hue} key={`${rowIndex}-${columnIndex}`} />;
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
			<div className="w-[100vw] h-[100vh] bg-gray-950 overflow-hidden flex ">
				<div className="border-0 border-blue-500 w-1/2"></div>
				<div
					className="perspective-[547px] border-0 border-red-500 w-1/2"
					style={{ transform: `translateX(${translateX}px) translateY(${translateY}px)` }}
				>
					{/* <div className={`relative rotate-x-0 rotate-y-[-15deg]  translate-z-[0px]`}> */}
					<div
						className={`relative border-0 border-green-500 w-full h-full flex items-center justify-center`}
						style={{
							transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) translateX(${translateX2}px) translateY(${translateY2}px)`,
						}}
					>
						<div className="relative">
							{/* <div className="relative border-0 border-yellow-500">{getRows()}</div> */}
							<div className="relative w-100 h-100 bg-cyan-700"></div>
							{/* <div className="absolute z-5 top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-gray-950 via-transparent to-gray-950/50 via-65% pointer-events-none"></div> */}
							<div className="absolute z-5 top-0 left-0 right-0 bottom-0 bg-linear-[0deg,red_0%,blue_1%,teal_50%,blue_99%,yellow_100%]"></div>
						</div>
					</div>
				</div>
			</div>
			<div className="relative">
				<div className="fixed top-4 left-4 z-10 flex gap-4 flex-col">
					<div className="text-white text-sm mb-2">Control 10x10 Area (highlighted with blue rings)</div>
					<div className="flex gap-2">
						<button
							className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md"
							onClick={() => handleToggleControlArea('on')}
						>
							Turn On Area
						</button>
						<button
							className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md"
							onClick={() => handleToggleControlArea('off')}
						>
							Turn Off Area
						</button>
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
