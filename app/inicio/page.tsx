import { getPublicProfile } from "../about-me/profile-data";
import { PortfolioExperience } from "../components/portfolio-experience";

export const dynamic = "force-dynamic";

export default async function InicioPage() {
  const result = await getPublicProfile();
  const profile = result.status === "success" ? result.profile : null;

  return (
    <PortfolioExperience
      publicName={profile?.publicName ?? "Amilcar Xicay"}
    />
  );
}
