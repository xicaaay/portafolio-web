export type PublicSocialLink = {
  key: string;
  platform: string;
  label: string;
  url: string;
  username: string | null;
  iconLibrary: string | null;
  iconKey: string | null;
  displayOrder: number;
};

export type PublicProfile = {
  publicName: string | null;
  headline: string | null;
  shortBio: string | null;
  longBio: string | null;
  profileImageUrl: string | null;
  resumeUrl: string | null;
  publicEmail: string | null;
  socialLinks: PublicSocialLink[];
};

export type ProfileLoadResult =
  | {
      status: "success";
      profile: PublicProfile;
    }
  | {
      status: "empty";
    }
  | {
      status: "error";
      message: string;
    };
