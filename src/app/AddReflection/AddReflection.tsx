interface AddReflectionProps {
	x: number;
	y: number;
	z: number;
	children: React.ReactNode;
}

export default function AddReflection({ x, y, z, children }: AddReflectionProps) {
	return (
		<>
			<div
				className={`absolute flex flex-col justify-end`}
				style={{
					transform: `translateZ(${-z}px)`,
					bottom: `${y}px`,
					left: `${x}px`,
				}}
			>
				{children}
			</div>
			<div
				className={`absolute bottom-0 scale-y-[-1] blur-[20px] opacity-20 flex flex-col justify-end`}
				style={{
					// transform: `translateY(calc(100%+${y}px)) translateZ(${-z}px)`,
					transform: `translate3d(0, calc(-100% - ${y}px), ${-z}px)`,
					left: `${x}px`,
				}}
			>
				{children}
			</div>
		</>
	);
}
