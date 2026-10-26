import "server-only";

import { getPayload } from "payload";
import config from "@payload-config";

/** Ejemplo de lectura segura desde un Server Component de Next.js. */
export async function getPublishedProjects() {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "projects",
    where: {
      status: { equals: "published" },
    },
    limit: 20,
    depth: 0,
    overrideAccess: false,
  });

  return result.docs;
}
