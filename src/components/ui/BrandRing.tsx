export function BrandRing({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden>
      <defs>
        <path id="aurel-circle" d="M 100,100 m -72,0 a 72,72 0 1,1 144,0 a 72,72 0 1,1 -144,0" />
      </defs>
      <text fill="#c5c8cc80" fontSize="8" letterSpacing="0.35em" fontFamily="IBM Plex Mono, monospace">
        <textPath href="#aurel-circle" startOffset="0%">
          AUREL · TYPE-01 · BEYOND THE DRIVE · PRECISION ENGINEERING ·
        </textPath>
      </text>
    </svg>
  );
}