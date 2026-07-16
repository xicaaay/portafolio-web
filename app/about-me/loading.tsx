import { RouteTransitionLink } from "../components/route-transition-link";
import { SectionNavigation } from "../components/section-navigation";

export default function Loading() {
  return (
    <main
      className="grid min-h-svh grid-rows-[auto_1fr_auto] overflow-x-clip bg-background p-[clamp(1.25rem,3vw,3rem)] text-foreground"
      aria-busy="true"
      aria-label="Cargando perfil"
    >
      <header className="internal-header">
        <RouteTransitionLink href="/" className="internal-brand font-display">
          AX
        </RouteTransitionLink>
        <span className="internal-header-meta font-mono">PORTFOLIO / 2026</span>
      </header>

      <div
        className="mx-auto grid w-full max-w-[96rem] animate-pulse gap-[clamp(2.75rem,5vw,5.75rem)] py-[clamp(4rem,8vh,7rem)]"
        aria-hidden="true"
      >
        <section className="grid gap-[clamp(2rem,4vw,3.75rem)]">
          <div className="grid gap-[clamp(1rem,2vw,1.5rem)]">
            <div className="h-[clamp(4rem,9vw,9rem)] w-[min(72%,58rem)] bg-[var(--surface)]" />
            <div className="h-[clamp(0.75rem,1vw,1rem)] w-[min(44%,24rem)] bg-[var(--surface)]" />
          </div>

          <div className="grid gap-[clamp(1.5rem,3.2vw,3.25rem)] lg:grid-cols-[minmax(0,1.35fr)_minmax(15rem,0.65fr)]">
            <div className="grid min-h-[clamp(16rem,28vw,26rem)] content-between gap-8 border border-[var(--line)] bg-[var(--surface)] p-[clamp(1.5rem,3.2vw,3rem)]">
              <div className="h-[0.75rem] w-[min(30%,8rem)] bg-[var(--surface-raised)]" />
              <div className="grid gap-3">
                <div className="h-[1rem] w-full bg-[var(--surface-raised)]" />
                <div className="h-[1rem] w-[88%] bg-[var(--surface-raised)]" />
                <div className="h-[1rem] w-[72%] bg-[var(--surface-raised)]" />
              </div>
            </div>

            <div className="aspect-[4/5] w-full max-w-[28rem] justify-self-end bg-[var(--surface)] sm:max-w-[26rem] lg:max-w-none" />
          </div>
        </section>

        <section className="grid gap-[clamp(1.75rem,3vw,2.75rem)] border-t border-[var(--line)] pt-[clamp(1.75rem,3vw,2.75rem)] lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.42fr)]">
          <div className="grid content-start gap-6">
            <div className="h-[0.75rem] w-[min(30%,8rem)] bg-[var(--surface)]" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div className="flex items-center gap-3" key={index}>
                  <div className="size-[2.25rem] rounded-full bg-[var(--surface)]" />
                  <div className="grid flex-1 gap-2">
                    <div className="h-[0.8rem] w-[60%] bg-[var(--surface)]" />
                    <div className="h-[0.65rem] w-[78%] bg-[var(--surface)]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="min-h-[12rem] border border-[var(--line)] bg-[var(--surface)]" />
        </section>
      </div>

      <SectionNavigation />
    </main>
  );
}
