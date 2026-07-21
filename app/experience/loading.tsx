export default function Loading() {
  return (
    <main className="grid min-h-svh content-start gap-[clamp(2rem,5vw,5rem)] bg-background p-[clamp(1.25rem,3vw,3rem)] text-foreground">
      <div className="h-[clamp(2rem,3vw,3.2rem)] w-[clamp(3rem,5vw,5rem)] animate-pulse bg-[var(--surface)]" />
      <div className="h-[clamp(4rem,12vw,12rem)] w-full animate-pulse bg-[var(--surface)]" />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="min-h-[30rem] animate-pulse bg-[var(--surface)]" />
        <div className="min-h-[30rem] animate-pulse bg-[var(--surface)]" />
      </div>
    </main>
  );
}
