import type { SVGProps } from 'react';

export interface AstrolabeIconProps extends SVGProps<SVGSVGElement> {
	mainColor?: string;
	accentColor?: string;
	size?: number;
	title?: string;
}


const AstrolabeIcon = ({
	mainColor = '#8B5A2B',
	accentColor = '#D4A24C',
	size = 128,
	title = 'Astrolabe',
	...props
}: AstrolabeIconProps) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 200 200'
			width={size}
			height={size}
			role='img'
			aria-label={title}
			shapeRendering='geometricPrecision'
			{...props}
		>
			<title>{title}</title>

			{/* ---------- Mater: squared outer frame + inner circle ---------- */}
			<rect
				x='10'
				y='10'
				width='180'
				height='180'
				fill='none'
				stroke={mainColor}
				strokeWidth='4'
			/>
			<circle
				cx='100'
				cy='100'
				r='84'
				fill='none'
				stroke={mainColor}
				strokeWidth='2.5'
			/>

			{/* Corner blocks on frame (squared ornament) */}
			{[
				[10, 10],
				[170, 10],
				[10, 170],
				[170, 170],
			].map(([x, y], i) => (
				<rect
					key={`corner-${i}`}
					x={x}
					y={y}
					width='20'
					height='20'
					fill='none'
					stroke={accentColor}
					strokeWidth='2'
				/>
			))}

			{/* ---------- Degree scale: squared radial ticks ---------- */}
			{Array.from({ length: 72 }).map((_, i) => {
				const angle = (i * 5 * Math.PI) / 180;
				const isMajor = i % 6 === 0;
				const r1 = 84;
				const r2 = isMajor ? 72 : 78;
				return (
					<line
						key={`tick-${i}`}
						x1={100 + r1 * Math.cos(angle)}
						y1={100 + r1 * Math.sin(angle)}
						x2={100 + r2 * Math.cos(angle)}
						y2={100 + r2 * Math.sin(angle)}
						stroke={accentColor}
						strokeWidth={isMajor ? 3 : 1.5}
						strokeLinecap='butt'
					/>
				);
			})}

			{/* ---------- Climate plate: square grid + circles ---------- */}
			<rect
				x='46'
				y='46'
				width='108'
				height='108'
				fill='none'
				stroke={accentColor}
				strokeWidth='1'
				opacity='0.6'
			/>
			<line
				x1='100'
				y1='46'
				x2='100'
				y2='154'
				stroke={accentColor}
				strokeWidth='1'
				opacity='0.45'
			/>
			<line
				x1='46'
				y1='100'
				x2='154'
				y2='100'
				stroke={accentColor}
				strokeWidth='1'
				opacity='0.45'
			/>
			<circle
				cx='100'
				cy='100'
				r='60'
				fill='none'
				stroke={accentColor}
				strokeWidth='1'
				opacity='0.7'
			/>
			<circle
				cx='100'
				cy='100'
				r='38'
				fill='none'
				stroke={accentColor}
				strokeWidth='1'
				opacity='0.7'
			/>
			<circle
				cx='100'
				cy='100'
				r='18'
				fill='none'
				stroke={accentColor}
				strokeWidth='1'
				opacity='0.7'
			/>

			{/* ---------- Rete: offset ecliptic + squared star pointers ---------- */}
			<circle
				cx='100'
				cy='74'
				r='38'
				fill='none'
				stroke={mainColor}
				strokeWidth='2.5'
			/>
			<rect x='98' y='72' width='4' height='4' fill={accentColor} />

			{/* Squared star pointers (diamond/rect motif) */}
			{[
				{ x: 134, y: 58, rot: -20 },
				{ x: 126, y: 128, rot: 45 },
				{ x: 64, y: 126, rot: -60 },
				{ x: 68, y: 54, rot: 15 },
			].map((s, i) => (
				<g
					key={`star-${i}`}
					transform={`translate(${s.x} ${s.y}) rotate(${s.rot})`}
				>
					<rect
						x='-5'
						y='-5'
						width='10'
						height='10'
						fill={accentColor}
						stroke={mainColor}
						strokeWidth='1'
						transform='rotate(45)'
					/>
				</g>
			))}

			{/* Straight rete connectors */}
			<line
				x1='68'
				y1='54'
				x2='134'
				y2='58'
				stroke={mainColor}
				strokeWidth='2'
			/>
			<line
				x1='64'
				y1='126'
				x2='126'
				y2='128'
				stroke={mainColor}
				strokeWidth='2'
			/>

			{/* ---------- Rule: flat-ended squared arm ---------- */}
			<g transform='rotate(-25 100 100)'>
				<rect x='18' y='97' width='164' height='6' fill={mainColor} />
				<rect x='14' y='93' width='8' height='14' fill={accentColor} />
				<rect x='178' y='93' width='8' height='14' fill={accentColor} />
			</g>

			{/* ---------- Central pin (square) ---------- */}
			<rect x='94' y='94' width='12' height='12' fill={mainColor} />
			<rect x='97' y='97' width='6' height='6' fill={accentColor} />

			{/* ---------- Throne: rectilinear suspension bracket ---------- */}
			<rect
				x='88'
				y='0'
				width='24'
				height='14'
				fill='none'
				stroke={mainColor}
				strokeWidth='3'
			/>
			<rect
				x='94'
				y='2'
				width='12'
				height='10'
				fill='none'
				stroke={accentColor}
				strokeWidth='2'
			/>
			<line
				x1='88'
				y1='14'
				x2='88'
				y2='20'
				stroke={mainColor}
				strokeWidth='3'
			/>
			<line
				x1='112'
				y1='14'
				x2='112'
				y2='20'
				stroke={mainColor}
				strokeWidth='3'
			/>
		</svg>
	);
};

export default AstrolabeIcon;
