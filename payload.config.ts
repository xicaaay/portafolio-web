import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { buildConfig } from "payload";

import { ContactMessages } from "./collections/ContactMessages";
import { Projects } from "./collections/Projects";
import { Experiences } from "./collections/Experiences";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { Profile } from "./globals/Profile";
import { Users } from "./collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: dirname,
    },
  },
  collections: [Users, Media, Projects, Experiences, Posts, ContactMessages],
  globals: [Profile],
  db: mongooseAdapter({
    url: process.env.DATABASE_URL ?? "",
  }),
  /* Contenido en español (principal) e inglés; si falta una traducción se muestra la española. */
  localization: {
    locales: [
      { code: "es", label: "Español" },
      { code: "en", label: "English" },
    ],
    defaultLocale: "es",
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? "",
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
