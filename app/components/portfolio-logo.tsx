type PortfolioLogoProps = {
  className?: string;
};

export function PortfolioLogo({ className = "" }: PortfolioLogoProps) {
  return (
    <span
      className={`portfolio-logo ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
