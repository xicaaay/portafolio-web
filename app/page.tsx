export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background px-6 py-10 text-foreground md:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1600px] flex-col justify-between">
        <header className="font-mono text-xs uppercase tracking-[0.08em]">
          ● Menú interactivo
        </header>

        <section className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <h1 className="font-display text-[clamp(4rem,8vw,8rem)] uppercase leading-[0.78] tracking-[-0.045em]">
              Amilcar
              <br />
              Dev
            </h1>

            <div className="mt-10 border-t border-current/40 pt-7">
              <p className="font-sans text-base">
                Desarrollador full stack
              </p>

              <p className="mt-3 font-sans text-sm opacity-60">
                Construyo sistemas, interfaces, APIs e integraciones.
              </p>
            </div>
          </div>

          <nav className="flex flex-col">
            <MenuItem number="01/" label="Inicio" />
            <MenuItem number="02/" label="Proyectos" outlined />
            <MenuItem number="03/" label="Tecnologías" />
            <MenuItem number="04/" label="Experiencia" />
            <MenuItem number="05/" label="Contacto" />
          </nav>
        </section>
      </div>
    </main>
  );
}

type MenuItemProps = {
  number: string;
  label: string;
  outlined?: boolean;
};

function MenuItem({ number, label, outlined = false }: MenuItemProps) {
  return (
    <div className="flex items-start gap-4 md:gap-7">
      <span className="mt-2 font-mono text-xs md:mt-4 md:text-sm">
        {number}
      </span>

      <span
        className={`
          font-display
          text-[clamp(3.2rem,8vw,9rem)]
          uppercase
          leading-[0.78]
          tracking-[-0.045em]
          ${outlined ? "text-outline" : ""}
        `}
      >
        {label}
      </span>
    </div>
  );
}