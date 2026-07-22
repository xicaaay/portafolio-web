export default function Loading() {
  return (
    <main className="min-h-svh bg-background p-[clamp(1rem,3vw,3rem)] text-foreground" aria-label="Cargando proyectos">
      <div className="flex items-center justify-between border-b border-[var(--line-soft)] pb-5">
        <span className="h-8 w-16 animate-pulse rounded-full bg-[var(--surface)]" />
        <span className="h-3 w-24 animate-pulse bg-[var(--surface)]" />
      </div>
      <div className="grid gap-5 py-[clamp(4rem,9vw,8rem)]">
        <span className="h-3 w-44 animate-pulse bg-[var(--surface)]" />
        <span className="h-[clamp(4rem,10vw,9rem)] w-[min(100%,56rem)] animate-pulse bg-[var(--surface)]" />
        <span className="h-5 w-[min(100%,38rem)] animate-pulse bg-[var(--surface)]" />
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="grid gap-4" key={index}>
            <span className="aspect-square animate-pulse rounded-[clamp(1rem,1.5vw,1.4rem)] bg-[var(--surface)]" />
            <span className="h-4 w-2/3 animate-pulse bg-[var(--surface)]" />
            <span className="h-3 w-full animate-pulse bg-[var(--surface)]" />
          </div>
        ))}
      </div>
    </main>
  );
}
