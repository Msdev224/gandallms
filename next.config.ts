// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       { 
//         hostname: "gandal-lms.t3.storage.dev", 
//         port: '',
//         protocol: "https"
//       }
//     ],
//   },
// };

// export default nextConfig;


// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gandal-lms.t3.storage.dev',
        port: '', // ou undefined
      },
    ],
  },
}

export default nextConfig