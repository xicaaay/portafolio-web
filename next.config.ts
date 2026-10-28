import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  devIndicators: false,
};

export default withPayload(nextConfig);
