import type { ReactNode, SVGProps } from "react";

export interface BrutalistIconProps extends SVGProps<SVGSVGElement> {
  mainColor?: string;
  accentColor?: string;
  size?: number;
  title?: string;
}

type IconProps = BrutalistIconProps;

interface IconBaseProps extends SVGProps<SVGSVGElement> {
  children: ReactNode;
  size?: number;
  title?: string;
}

/* ============================================================
 * Shared wrapper — keeps all icons on a consistent 200x200 grid
 * ============================================================ */
const IconBase = ({ children, size = 96, title, ...props }: IconBaseProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 200"
    width={size}
    height={size}
    role="img"
    aria-label={title}
    shapeRendering="geometricPrecision"
    strokeLinecap="butt"
    strokeLinejoin="miter"
    {...props}
  >
    <title>{title}</title>
    {children}
  </svg>
);

/* ============================================================
 * 1. LinkedIn
 * ============================================================ */
export const LinkedInIcon = ({
  mainColor = "#0A66C2",
  accentColor = "#FFFFFF",
  size = 96,
  title = "LinkedIn",
  ...props
}: BrutalistIconProps) => (
  <IconBase size={size} title={title} {...props}>
    <rect x="10" y="10" width="180" height="180" fill={mainColor} />
    <rect x="34" y="34" width="30" height="30" fill={accentColor} />
    <rect x="34" y="76" width="30" height="90" fill={accentColor} />
    <path
      d="M76 76 H106 V90 H107.5
         C112 82 122 74 138 74
         C164 74 166 92 166 112 V166 H136 V118
         C136 106 135 92 120 92
         C105 92 104 105 104 118 V166 H76 Z"
      fill={accentColor}
    />
  </IconBase>
);

/* ============================================================
 * 3. Warning / Alert
 * ============================================================ */
export const WarningIcon = ({
  mainColor = "#111111",
  accentColor = "#FFC107",
  size = 96,
  title = "Warning",
  ...props
}: BrutalistIconProps) => (
  <IconBase size={size} title={title} {...props}>
    <rect x="10" y="10" width="180" height="180" fill={mainColor} />
    {/* Stepped triangle */}
    <path
      d="M100 38 L172 162 H28 Z"
      fill={accentColor}
    />
    {/* Square exclamation */}
    <rect x="94" y="76" width="12" height="48" fill={mainColor} />
    <rect x="94" y="132" width="12" height="12" fill={mainColor} />
  </IconBase>
);

/* ============================================================
 * 4. Lock In (padlock)
 * ============================================================ */
export const LockInIcon = ({
  mainColor = "#111111",
  accentColor = "#22C55E",
  size = 96,
  title = "Lock In",
  ...props
}: BrutalistIconProps) => (
  <IconBase size={size} title={title} {...props}>
    <rect x="10" y="10" width="180" height="180" fill={mainColor} />
    {/* Shackle — squared arch */}
    <path
      d="M68 96 V70 H80 V58 H120 V70 H132 V96 H120 V70 H80 V96 Z"
      fill={accentColor}
    />
    {/* Body */}
    <rect x="52" y="96" width="96" height="76" fill={accentColor} />
    {/* Keyhole (square) */}
    <rect x="92" y="120" width="16" height="16" fill={mainColor} />
    <rect x="96" y="136" width="8" height="20" fill={mainColor} />
  </IconBase>
);

/* ============================================================
 * 5. Anonymity (masked face)
 * ============================================================ */
export const AnonymityIcon = ({
  mainColor = "#111111",
  accentColor = "#A855F7",
  size = 96,
  title = "Anonymity",
  ...props
}: BrutalistIconProps) => (
  <IconBase size={size} title={title} {...props}>
    <rect x="10" y="10" width="180" height="180" fill={mainColor} />
    {/* Head — squared */}
    <rect x="46" y="40" width="108" height="100" fill={accentColor} />
    {/* Mask band */}
    <rect x="46" y="84" width="108" height="28" fill={mainColor} />
    {/* Eye slots */}
    <rect x="62" y="90" width="24" height="16" fill={accentColor} />
    <rect x="114" y="90" width="24" height="16" fill={accentColor} />
    {/* Shoulders */}
    <rect x="34" y="140" width="132" height="24" fill={accentColor} />
    {/* Question-like block (hidden identity) */}
    <rect x="92" y="150" width="16" height="8" fill={mainColor} />
  </IconBase>
);

/* ============================================================
 * 6. Velocity (speed chevrons)
 * ============================================================ */
export const VelocityIcon = ({
  mainColor = "#111111",
  accentColor = "#F97316",
  size = 96,
  title = "Velocity",
  ...props
}: BrutalistIconProps) => (
  <IconBase size={size} title={title} {...props}>
    <rect x="10" y="10" width="180" height="180" fill={mainColor} />
    {/* Three stepped chevrons */}
    {[0, 1, 2].map((i) => {
      const x = 40 + i * 40;
      return (
        <path
          key={i}
          d={`M${x} 60 L${x + 40} 100 L${x} 140 L${x + 20} 140 L${x + 60} 100 L${x + 20} 60 Z`}
          fill={accentColor}
          opacity={1 - i * 0.25}
        />
      );
    })}
  </IconBase>
);

/* ============================================================
 * 7. Globe
 * ============================================================ */
export const GlobeIcon = ({
  mainColor = "#111111",
  accentColor = "#3B82F6",
  size = 96,
  title = "Globe",
  ...props
}: BrutalistIconProps) => (
  <IconBase size={size} title={title} {...props}>
    <rect x="10" y="10" width="180" height="180" fill={mainColor} />
    {/* Outer square frame */}
    <rect x="30" y="30" width="140" height="140" fill="none" stroke={accentColor} strokeWidth="8" />
    {/* Vertical meridian */}
    <rect x="94" y="30" width="12" height="140" fill={accentColor} />
    {/* Horizontal equator */}
    <rect x="30" y="94" width="140" height="12" fill={accentColor} />
    {/* Stepped "curved" meridians (pixelated circle) */}
    <rect x="52" y="46" width="8" height="108" fill={accentColor} opacity="0.6" />
    <rect x="140" y="46" width="8" height="108" fill={accentColor} opacity="0.6" />
    <rect x="46" y="52" width="108" height="8" fill={accentColor} opacity="0.6" />
    <rect x="46" y="140" width="108" height="8" fill={accentColor} opacity="0.6" />
  </IconBase>
);

/* ============================================================
 * 8. Shield
 * ============================================================ */
export const ShieldIcon = ({
  mainColor = "#111111",
  accentColor = "#14B8A6",
  size = 96,
  title = "Shield",
  ...props
}: BrutalistIconProps) => (
  <IconBase size={size} title={title} {...props}>
    <rect x="10" y="10" width="180" height="180" fill={mainColor} />
    {/* Stepped shield */}
    <path
      d="M40 40 H160 V110 H152 V128 H144 V144 H128 V156 H116 V164 H84 V156 H72 V144 H56 V128 H48 V110 H40 Z"
      fill={accentColor}
    />
    {/* Inner notch */}
    <path
      d="M68 68 H132 V108 H124 V124 H112 V136 H88 V124 H76 V108 H68 Z"
      fill={mainColor}
    />
  </IconBase>
);

/* ============================================================
 * 9. Timer / Hourglass
 * ============================================================ */
export const TimerIcon = ({
  mainColor = "#111111",
  accentColor = "#EF4444",
  size = 96,
  title = "Timer",
  ...props
}: BrutalistIconProps) => (
  <IconBase size={size} title={title} {...props}>
    <rect x="10" y="10" width="180" height="180" fill={mainColor} />
    {/* Top & bottom rails */}
    <rect x="50" y="30" width="100" height="12" fill={accentColor} />
    <rect x="50" y="158" width="100" height="12" fill={accentColor} />
    {/* Left & right posts */}
    <rect x="50" y="42" width="12" height="116" fill={accentColor} />
    <rect x="138" y="42" width="12" height="116" fill={accentColor} />
    {/* Stepped sand (top triangle) */}
    <path
      d="M62 54 H138 V66 H126 V78 H114 V90 H106 V100 H94 V90 H86 V78 H74 V66 H62 Z"
      fill={accentColor}
    />
    {/* Stepped sand (bottom triangle) */}
    <path
      d="M94 100 H106 V110 H114 V122 H126 V134 H138 V146 H62 V134 H74 V122 H86 V110 H94 Z"
      fill={accentColor}
    />
  </IconBase>
);

/* ============================================================
 * 10. Zap / Lightning
 * ============================================================ */
export const ZapIcon = ({
  mainColor = "#111111",
  accentColor = "#FACC15",
  size = 96,
  title = "Zap",
  ...props
}: BrutalistIconProps) => (
  <IconBase size={size} title={title} {...props}>
    <rect x="10" y="10" width="180" height="180" fill={mainColor} />
    {/* Stepped lightning bolt */}
    <path
      d="M116 30 L56 110 H90 L76 170 L140 90 H106 L120 30 Z"
      fill={accentColor}
    />
    {/* Inner core line */}
    <path
      d="M112 46 L74 102 H98 L88 154 L122 98 H100 Z"
      fill={mainColor}
    />
  </IconBase>
);

/* ============================================================
 * GitHub (Redo — Brutalist Cat)
 * ============================================================ */
export const GitHubIcon = ({
  mainColor = "#181717",
  accentColor = "#FFFFFF",
  size = 96,
  title = "GitHub",
  ...props
}: IconProps) => (
  <IconBase size={size} title={title} {...props}>
    <rect x="10" y="10" width="180" height="180" fill={mainColor} />
    {/* Head block */}
    <rect x="44" y="54" width="112" height="96" fill={accentColor} />
    {/* Ears (stepped) */}
    <rect x="44" y="38" width="24" height="16" fill={accentColor} />
    <rect x="132" y="38" width="24" height="16" fill={accentColor} />
    {/* Ear notches */}
    <rect x="56" y="38" width="12" height="8" fill={mainColor} />
    <rect x="132" y="38" width="12" height="8" fill={mainColor} />
    {/* Eyes */}
    <rect x="68" y="78" width="16" height="20" fill={mainColor} />
    <rect x="116" y="78" width="16" height="20" fill={mainColor} />
    {/* Nose bridge */}
    <rect x="92" y="98" width="16" height="8" fill={mainColor} />
    {/* Mouth */}
    <rect x="76" y="114" width="48" height="8" fill={mainColor} />
    {/* Whisker stubs */}
    <rect x="28" y="86" width="16" height="8" fill={accentColor} />
    <rect x="28" y="110" width="16" height="8" fill={accentColor} />
    <rect x="156" y="86" width="16" height="8" fill={accentColor} />
    <rect x="156" y="110" width="16" height="8" fill={accentColor} />
  </IconBase>
);

/* ============================================================
 * Spring Boot
 * ============================================================ */
export const SpringBootIcon = ({
  mainColor = "#6DB33F",
  accentColor = "#FFFFFF",
  size = 96,
  title = "Spring Boot",
  ...props
}: IconProps) => (
  <IconBase size={size} title={title} {...props}>
    <rect x="10" y="10" width="180" height="180" fill={mainColor} />
    {/* Stepped leaf shape (abstracted from official mark) */}
    <path
      d="M100 40 L140 60 L140 100 L120 120 L100 140 L80 120 L60 100 L60 60 Z"
      fill={accentColor}
    />
    {/* Inner cutout */}
    <rect x="88" y="68" width="24" height="56" fill={mainColor} />
    {/* Stem */}
    <rect x="96" y="124" width="8" height="20" fill={accentColor} />
  </IconBase>
);

/* ============================================================
 * Bun Runtime
 * ============================================================ */
export const BunIcon = ({
  mainColor = "#FBF0DF",
  accentColor = "#14151A",
  size = 96,
  title = "Bun",
  ...props
}: IconProps) => (
  <IconBase size={size} title={title} {...props}>
    <rect x="10" y="10" width="180" height="180" fill={accentColor} />
    {/* Bun body (stepped oval) */}
    <rect x="44" y="60" width="112" height="72" fill={mainColor} />
    <rect x="52" y="52" width="96" height="8" fill={mainColor} />
    <rect x="52" y="132" width="96" height="8" fill={mainColor} />
    {/* Ears */}
    <rect x="60" y="36" width="20" height="20" fill={mainColor} />
    <rect x="120" y="36" width="20" height="20" fill={mainColor} />
    {/* Eyes */}
    <rect x="72" y="80" width="12" height="16" fill={accentColor} />
    <rect x="116" y="80" width="12" height="16" fill={accentColor} />
    {/* Nose */}
    <rect x="94" y="96" width="12" height="8" fill={accentColor} />
    {/* Mouth */}
    <rect x="82" y="112" width="36" height="6" fill={accentColor} />
  </IconBase>
);

/* ============================================================
 * React 19
 * ============================================================ */
export const React19Icon = ({
  mainColor = "#61DAFB",
  accentColor = "#20232A",
  size = 96,
  title = "React 19",
  ...props
}: IconProps) => (
  <IconBase size={size} title={title} {...props}>
    <rect x="10" y="10" width="180" height="180" fill={accentColor} />
    {/* Nucleus (square) */}
    <rect x="92" y="92" width="16" height="16" fill={mainColor} />
    {/* Orbit 1 — horizontal band */}
    <rect x="28" y="94" width="144" height="12" fill="none" stroke={mainColor} strokeWidth="4" />
    {/* Orbit 2 — diagonal (rotated rects) */}
    <g transform="rotate(60 100 100)">
      <rect x="28" y="94" width="144" height="12" fill="none" stroke={mainColor} strokeWidth="4" />
    </g>
    <g transform="rotate(-60 100 100)">
      <rect x="28" y="94" width="144" height="12" fill="none" stroke={mainColor} strokeWidth="4" />
    </g>
  </IconBase>
);

/* ============================================================
 * Vite
 * ============================================================ */
export const ViteIcon = ({
  mainColor = "#646CFF",
  accentColor = "#FFFFFF",
  size = 96,
  title = "Vite",
  ...props
}: IconProps) => (
  <IconBase size={size} title={title} {...props}>
    <rect x="10" y="10" width="180" height="180" fill={mainColor} />
    {/* Stepped lightning bolt */}
    <path
      d="M118 30 L58 110 H92 L78 170 L142 90 H108 L122 30 Z"
      fill={accentColor}
    />
    {/* Inner bolt cutout */}
    <path
      d="M114 46 L76 102 H100 L90 154 L124 98 H102 Z"
      fill={mainColor}
    />
  </IconBase>
);

/* ============================================================
 * Cloudflare
 * ============================================================ */
export const CloudflareIcon = ({
  mainColor = "#F38020",
  accentColor = "#FFFFFF",
  size = 96,
  title = "Cloudflare",
  ...props
}: IconProps) => (
  <IconBase size={size} title={title} {...props}>
    <rect x="10" y="10" width="180" height="180" fill={mainColor} />
    {/* Cloud (stepped blocks) */}
    <rect x="44" y="96" width="112" height="40" fill={accentColor} />
    <rect x="60" y="76" width="80" height="24" fill={accentColor} />
    <rect x="76" y="60" width="48" height="20" fill={accentColor} />
    {/* Cloud cutout / negative space */}
    <rect x="60" y="116" width="80" height="12" fill={mainColor} />
    <rect x="76" y="76" width="48" height="12" fill={mainColor} />
    {/* Arrow tip */}
    <rect x="156" y="96" width="16" height="24" fill={accentColor} />
    <rect x="172" y="104" width="8" height="8" fill={accentColor} />
  </IconBase>
);

/* ============================================================
 * Sun (Light Mode)
 * ============================================================ */
export const SunIcon = ({
  mainColor = "#111111",
  accentColor = "#FACC15",
  size = 96,
  title = "Light mode",
  ...props
}: IconProps) => (
  <IconBase size={size} title={title} {...props}>
    <rect x="10" y="10" width="180" height="180" fill={mainColor} />
    {/* Core */}
    <rect x="80" y="80" width="40" height="40" fill={accentColor} />
    {/* Straight rays (square blocks) */}
    <rect x="94" y="24" width="12" height="36" fill={accentColor} />
    <rect x="94" y="140" width="12" height="36" fill={accentColor} />
    <rect x="24" y="94" width="36" height="12" fill={accentColor} />
    <rect x="140" y="94" width="36" height="12" fill={accentColor} />
    {/* Diagonal rays (stepped) */}
    <rect x="46" y="46" width="20" height="20" fill={accentColor} />
    <rect x="134" y="46" width="20" height="20" fill={accentColor} />
    <rect x="46" y="134" width="20" height="20" fill={accentColor} />
    <rect x="134" y="134" width="20" height="20" fill={accentColor} />
  </IconBase>
);

/* ============================================================
 * Moon (Dark Mode) — Stepped Crescent
 * ============================================================ */
export const MoonIcon = ({
  mainColor = "#111111",
  accentColor = "#E5E7EB",
  size = 96,
  title = "Dark mode",
  ...props
}: IconProps) => (
  <IconBase size={size} title={title} {...props}>
    <rect x="10" y="10" width="180" height="180" fill={mainColor} />

    {/* Crescent: stacked horizontal slabs, right side bitten out */}
    {/* Row 1 (top) */}
    <rect x="96" y="40" width="40" height="12" fill={accentColor} />
    {/* Row 2 */}
    <rect x="80" y="52" width="52" height="12" fill={accentColor} />
    {/* Row 3 */}
    <rect x="68" y="64" width="56" height="12" fill={accentColor} />
    {/* Row 4 */}
    <rect x="60" y="76" width="52" height="12" fill={accentColor} />
    {/* Row 5 (widest body) */}
    <rect x="56" y="88" width="44" height="12" fill={accentColor} />
    {/* Row 6 */}
    <rect x="56" y="100" width="36" height="12" fill={accentColor} />
    {/* Row 7 */}
    <rect x="60" y="112" width="36" height="12" fill={accentColor} />
    {/* Row 8 */}
    <rect x="68" y="124" width="40" height="12" fill={accentColor} />
    {/* Row 9 */}
    <rect x="80" y="136" width="44" height="12" fill={accentColor} />
    {/* Row 10 (bottom) */}
    <rect x="96" y="148" width="36" height="12" fill={accentColor} />

    {/* Stars */}
    <rect x="132" y="52" width="8" height="8" fill={accentColor} />
    <rect x="150" y="80" width="6" height="6" fill={accentColor} />
    <rect x="140" y="128" width="8" height="8" fill={accentColor} />
    <rect x="120" y="152" width="6" height="6" fill={accentColor} />
  </IconBase>
);

/* ============================================================
 * Toggle (Combined — both themes in one glyph)
 * ============================================================ */
export const ThemeToggleIcon = ({
  mainColor = "#111111",
  accentColor = "#FACC15",
  size = 96,
  title = "Toggle theme",
  ...props
}: IconProps) => (
  <IconBase size={size} title={title} {...props}>
    <rect x="10" y="10" width="180" height="180" fill={mainColor} />
    {/* Left half: sun (light) */}
    <rect x="30" y="76" width="56" height="48" fill={accentColor} />
    <rect x="54" y="52" width="8" height="16" fill={accentColor} />
    <rect x="54" y="132" width="8" height="16" fill={accentColor} />
    <rect x="20" y="96" width="16" height="8" fill={accentColor} />
    <rect x="80" y="96" width="16" height="8" fill={accentColor} />
    {/* Divider */}
    <rect x="96" y="30" width="8" height="140" fill={mainColor} />
    <rect x="94" y="30" width="4" height="140" fill={accentColor} opacity="0.4" />
    {/* Right half: moon (dark) — crescent */}
    <rect x="120" y="60" width="56" height="80" fill={accentColor} />
    <rect x="120" y="60" width="12" height="12" fill={mainColor} />
    <rect x="164" y="60" width="12" height="12" fill={mainColor} />
    <rect x="120" y="128" width="12" height="12" fill={mainColor} />
    <rect x="164" y="128" width="12" height="12" fill={mainColor} />
    <rect x="148" y="68" width="44" height="64" fill={mainColor} />
    {/* Star */}
    <rect x="132" y="44" width="8" height="8" fill={accentColor} />
  </IconBase>
);


const BrutalistIcons = {
  LinkedInIcon,
  GitHubIcon,
  WarningIcon,
  LockInIcon,
  AnonymityIcon,
  VelocityIcon,
  GlobeIcon,
  ShieldIcon,
  TimerIcon,
  ZapIcon,
  SpringBootIcon,
  BunIcon,
  React19Icon,
  ViteIcon,
  CloudflareIcon,
  SunIcon,
  MoonIcon,
  ThemeToggleIcon,
};

export default BrutalistIcons;