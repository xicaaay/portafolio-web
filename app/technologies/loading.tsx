export default function Loading() {
  return (
    <main className="grid min-h-svh content-start gap-[clamp(2rem,5vw,5rem)] bg-background p-[clamp(1.25rem,3vw,3rem)] text-foreground">
      <div className="h-[clamp(2rem,3vw,3.2rem)] w-[clamp(3rem,5vw,5rem)] animate-pulse bg-[var(--surface)]" />
      <div className="h-[clamp(4rem,12vw,12rem)] w-full animate-pulse bg-[var(--surface)]" />
      <div className="grid gap-8 rounded-[clamp(1.5rem,3vw,3rem)] bg-[var(--surface)] p-[clamp(1rem,3vw,3rem)]">
        {Array.from({ length: 3 }).map((_, categoryIndex) => (
          <div className="grid gap-3" key={categoryIndex}>
            <div className="h-4 w-full animate-pulse border-b border-[var(--line)] pb-6" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: categoryIndex === 0 ? 3 : 2 }).map(
                (_, technologyIndex) => (
                  <div
                    className="h-[4.75rem] animate-pulse rounded-[1.15rem] bg-[var(--surface-raised)]"
                    key={technologyIndex}
                  />
                ),
              )}
            </div>
          </div>
        ))}

        <div className="min-h-[10rem] animate-pulse rounded-[clamp(1.25rem,2vw,2rem)] bg-[var(--surface-raised)]" />
      </div>
    </main>
  );
}
