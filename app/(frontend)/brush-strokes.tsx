type Stroke = {
  x: number;
  y: number;
  rotate: number;
  length: number;
  width: number;
  color: string;
  opacity: number;
};

/*
 * Trazos de brocha decorativos: cada uno se dibuja horizontal y se rota, así el
 * ruido del filtro sigue la dirección del trazo. Se acomodan en las esquinas y los
 * bordes para acompañar la composición sin pasar por detrás del texto.
 */
const WIDE_STROKES: readonly Stroke[] = [
  { x: -60, y: 860, rotate: -14, length: 620, width: 105, color: "#8db2ff", opacity: 0.3 },
  { x: 40, y: 806, rotate: -10, length: 420, width: 32, color: "#8db2ff", opacity: 0.22 },
  { x: 1020, y: 930, rotate: -10, length: 700, width: 120, color: "#01203f", opacity: 0.3 },
  { x: 1280, y: 40, rotate: 14, length: 420, width: 68, color: "#8db2ff", opacity: 0.22 },
  { x: -80, y: 130, rotate: -22, length: 300, width: 50, color: "#01203f", opacity: 0.24 },
  { x: 640, y: 70, rotate: -4, length: 520, width: 28, color: "#eef4ed", opacity: 0.11 },
  { x: 1610, y: 560, rotate: -80, length: 360, width: 62, color: "#8db2ff", opacity: 0.19 },
];

/* Versión vertical para pantallas angostas, donde el lienzo ancho se recortaría. */
const TALL_STROKES: readonly Stroke[] = [
  { x: -40, y: 1480, rotate: -12, length: 520, width: 90, color: "#8db2ff", opacity: 0.3 },
  { x: 480, y: 1570, rotate: -8, length: 520, width: 100, color: "#01203f", opacity: 0.3 },
  { x: 540, y: 90, rotate: 16, length: 380, width: 56, color: "#8db2ff", opacity: 0.22 },
  { x: -110, y: 700, rotate: -20, length: 300, width: 44, color: "#01203f", opacity: 0.24 },
  { x: 900, y: 820, rotate: -78, length: 340, width: 50, color: "#8db2ff", opacity: 0.17 },
];

type BrushCanvasProps = {
  className?: string;
  /* Prefijo único para los filtros, porque cada SVG convive en la misma página. */
  idPrefix: string;
  strokes: readonly Stroke[];
  viewBox: string;
};

function BrushCanvas({ className, idPrefix, strokes, viewBox }: BrushCanvasProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      viewBox={viewBox}
    >
      <defs>
        {strokes.map((_, index) => (
          <filter
            height="220%"
            id={`${idPrefix}-${index}`}
            key={index}
            width="130%"
            x="-15%"
            y="-60%"
          >
            <feTurbulence
              baseFrequency="0.008 0.16"
              numOctaves="3"
              result="noise"
              seed={index + 3}
              type="fractalNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="46"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        ))}
      </defs>

      {strokes.map((stroke, index) => (
        <path
          d={`M0 0 Q ${stroke.length * 0.5} ${-stroke.width * 0.25} ${stroke.length} ${stroke.width * 0.1}`}
          fill="none"
          filter={`url(#${idPrefix}-${index})`}
          key={index}
          opacity={stroke.opacity}
          stroke={stroke.color}
          strokeLinecap="round"
          strokeWidth={stroke.width}
          transform={`translate(${stroke.x} ${stroke.y}) rotate(${stroke.rotate})`}
        />
      ))}
    </svg>
  );
}

/* La hoja de estilos muestra una u otra versión según el ancho de la pantalla. */
export function BrushStrokes({
  tallClassName,
  wideClassName,
}: {
  tallClassName?: string;
  wideClassName?: string;
}) {
  return (
    <>
      <BrushCanvas
        className={wideClassName}
        idPrefix="brush-wide"
        strokes={WIDE_STROKES}
        viewBox="0 0 1600 900"
      />
      <BrushCanvas
        className={tallClassName}
        idPrefix="brush-tall"
        strokes={TALL_STROKES}
        viewBox="0 0 900 1600"
      />
    </>
  );
}
