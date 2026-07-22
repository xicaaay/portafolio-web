import { FiAlertCircle, FiInbox } from "react-icons/fi";
import { MagneticTitle } from "./magnetic-title";

type ContentStateProps = {
  type: "empty" | "error";
  title: string;
  message: string;
};

export function ContentState({ type, title, message }: ContentStateProps) {
  const Icon = type === "empty" ? FiInbox : FiAlertCircle;

  return (
    <section className="grid min-h-[clamp(18rem,42vw,32rem)] place-items-center border border-[var(--line)] bg-[var(--surface)] p-[clamp(1.5rem,5vw,4rem)] text-center">
      <div className="grid max-w-[38rem] justify-items-center gap-5">
        <span
          className="grid size-[clamp(3rem,5vw,4.5rem)] place-items-center rounded-full border border-[var(--line)] text-[var(--accent)] transition-transform duration-300 hover:scale-110"
          data-blue-icon
        >
          <Icon className="size-[clamp(1.2rem,2vw,1.8rem)]" aria-hidden="true" />
        </span>
        <p className="m-0 font-mono text-[clamp(0.62rem,0.72vw,0.78rem)] tracking-[0.1em] text-[var(--muted)] uppercase">
          {type === "empty" ? "SIN CONTENIDO" : "SERVICIO NO DISPONIBLE"}
        </p>
        <MagneticTitle as="h2" text={title} className="m-0 text-[clamp(1.55rem,3vw,3.2rem)] leading-[0.98] tracking-[-0.05em]" />
        <p className="m-0 text-[clamp(0.95rem,1.2vw,1.15rem)] leading-[1.7] text-[var(--muted)]">
          {message}
        </p>
      </div>
    </section>
  );
}
