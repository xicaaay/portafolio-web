import Image from "next/image";

/*
 * Pinceladas decorativas: imágenes WebP transparentes (public/pinceladas). La posición,
 * el giro y la opacidad de cada una viven en la hoja de estilos para poder
 * reacomodarlas por pantalla sin tocar el componente.
 */
const BRUSHES = {
  1: { src: "/pinceladas/pincelada-1.webp", width: 1552, height: 245 },
  2: { src: "/pinceladas/pincelada-2.webp", width: 1161, height: 75 },
  3: { src: "/pinceladas/pincelada-3.webp", width: 1380, height: 199 },
  4: { src: "/pinceladas/pincelada-4.webp", width: 1579, height: 231 },
  5: { src: "/pinceladas/pincelada-5.webp", width: 949, height: 92 },
  6: { src: "/pinceladas/pincelada-6.webp", width: 1071, height: 178 },
  /* Azul cobalto, para fondos claros. */
  7: { src: "/pinceladas/pincelada-azul-1.webp", width: 1576, height: 292 },
  8: { src: "/pinceladas/pincelada-azul-2.webp", width: 1279, height: 219 },
  9: { src: "/pinceladas/pincelada-azul-3.webp", width: 1055, height: 130 },
} as const;

export type BrushId = keyof typeof BRUSHES;

type BrushStrokesProps = {
  className?: string;
  /* Qué pinceladas dibujar y con qué clase se coloca cada una. */
  items: readonly { brush: BrushId; className: string }[];
};

export function BrushStrokes({ className, items }: BrushStrokesProps) {
  return (
    <div aria-hidden="true" className={className}>
      {items.map(({ brush, className: itemClass }) => {
        const image = BRUSHES[brush];
        return (
          <Image
            alt=""
            className={itemClass}
            height={image.height}
            key={`${brush}-${itemClass}`}
            sizes="(max-width: 896px) 70vw, 40vw"
            src={image.src}
            width={image.width}
          />
        );
      })}
    </div>
  );
}
