import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  output: 'standalone',
  async headers() {
    return [
      {
        source: "/tickets",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
      {
       
        source: "/((?!tickets).*)", // everything except /tickets (handled above)
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://andrewdover.com" }, // Your restricted production domain
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },

};



export default nextConfig;
