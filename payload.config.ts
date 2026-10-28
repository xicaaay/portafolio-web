import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { buildConfig } from "payload";

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
  collections: [Users, Media, Projects, Experiences, Posts],
  globals: [Profile],
  db: mongooseAdapter({
    url: process.env.DATABASE_URL ?? "",
  }),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? "",
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
