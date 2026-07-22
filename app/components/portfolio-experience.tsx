import { HomeScreen } from "./home-screen";

type PortfolioExperienceProps = {
  publicName: string;
};

export function PortfolioExperience({ publicName }: PortfolioExperienceProps) {
  return (
    <main className="portfolio-root">
      <HomeScreen publicName={publicName} />
    </main>
  );
}
