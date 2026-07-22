import { PortfolioExperience } from "./components/portfolio-experience";
import { getPublicProfile } from "./about-me/profile-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const result = await getPublicProfile();
  const profile = result.status === "success" ? result.profile : null;

  return (
    <PortfolioExperience
      profileImageUrl={profile?.profileImageUrl ?? null}
      publicName={profile?.publicName ?? "Amilcar Xicay"}
    />
  );
}
