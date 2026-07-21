export default function Loading() {
  return (
    <main className="grid min-h-svh content-start gap-[clamp(2rem,5vw,5rem)] bg-background p-[clamp(1.25rem,3vw,3rem)] text-foreground">
      <div className="h-[clamp(2rem,3vw,3.2rem)] w-[clamp(3rem,5vw,5rem)] animate-pulse bg-[var(--surface)]" />
      <div className="grid gap-5">
        <div className="h-[clamp(4rem,12vw,12rem)] w-full animate-pulse bg-[var(--surface)]" />
        <div className="h-5 w-full max-w-[38rem] animate-pulse bg-[var(--surface)]" />
      </div>
      <div className="grid gap-[clamp(2rem,5vw,5rem)]">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            className="grid min-h-[min(76svh,48rem)] animate-pulse overflow-hidden rounded-[clamp(1.25rem,2.5vw,2.25rem)] bg-[var(--surface)] lg:grid-cols-[minmax(15rem,0.72fr)_minmax(22rem,1.28fr)]"
            key={index}
          >
            <div className="grid content-between gap-8 border-b border-[var(--line)] p-[clamp(1.5rem,3vw,3rem)] lg:border-r lg:border-b-0">
              <div className="h-4 w-24 bg-[var(--surface-raised)]" />
              <div className="grid gap-4">
                <div className="h-12 w-4/5 bg-[var(--surface-raised)]" />
                <div className="h-4 w-full bg-[var(--surface-raised)]" />
                <div className="h-4 w-3/4 bg-[var(--surface-raised)]" />
              </div>
              <div className="h-4 w-20 bg-[var(--surface-raised)]" />
            </div>
            <div className="m-[clamp(1rem,3vw,3rem)] min-h-[22rem] rounded-[clamp(1rem,2vw,2rem)] bg-[var(--surface-raised)]" />
          </div>
        ))}
      </div>
    </main>
  );
}
