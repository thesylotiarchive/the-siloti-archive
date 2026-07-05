import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = (process.env.VERCEL_URL && process.env.VERCEL_ENV !== 'production')
  ? `https://${process.env.VERCEL_URL}`
  : (process.env.NEXT_PUBLIC_SITE_URL || 'https://the-siloti-archive.org');

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "The Sylheti Archive",
    template: "%s | The Sylheti Archive"
  },
  description: "A digital repository preserving the rich cultural, historical, and linguistic heritage of the Sylheti language and Nagri script. An initiative of the Siloti Archive Research & Cultural Centre.",
  keywords: ["Sylheti", "Siloti", "Nagri", "Sylhet", "Archive", "Cultural Heritage", "Language Preservation"],
  authors: [{ name: "Siloti Archive Research & Cultural Centre" }],
  creator: "Siloti Archive Research & Cultural Centre",
  publisher: "Siloti Archive Research & Cultural Centre",
  openGraph: {
    title: "The Sylheti Archive",
    description: "A digital repository preserving the rich cultural, historical, and linguistic heritage of the Sylheti language and Nagri script.",
    url: SITE_URL,
    siteName: "The Sylheti Archive",
    images: [
      {
        url: "/sarcc-v2-preview-image.png",
        width: 1200,
        height: 630,
        alt: "The Sylheti Archive - Preserving Cultural Heritage",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Sylheti Archive",
    description: "A digital repository preserving the rich cultural, historical, and linguistic heritage of the Sylheti language and Nagri script.",
    images: ["/sarcc-v2-preview-image.png"],
  },
  icons: {
    icon: [
      // Android Icons
      { rel: "icon", type: "image/png", sizes: "36x36", url: "/favicon/android-icon-36x36.png" },
      { rel: "icon", type: "image/png", sizes: "48x48", url: "/favicon/android-icon-48x48.png" },
      { rel: "icon", type: "image/png", sizes: "72x72", url: "/favicon/android-icon-72x72.png" },
      { rel: "icon", type: "image/png", sizes: "96x96", url: "/favicon/android-icon-96x96.png" },
      { rel: "icon", type: "image/png", sizes: "144x144", url: "/favicon/android-icon-144x144.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", url: "/favicon/android-icon-192x192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", url: "/favicon/android-icon-512x512.png" },

      // Apple Icons
      { rel: "apple-touch-icon", type: "image/ico", url: "/favicon/apple-icon.png" },
      { rel: "apple-touch-icon", sizes: "57x57", url: "/favicon/apple-icon-57x57.png" },
      { rel: "apple-touch-icon", sizes: "60x60", url: "/favicon/apple-icon-60x60.png" },
      { rel: "apple-touch-icon", sizes: "72x72", url: "/favicon/apple-icon-72x72.png" },
      { rel: "apple-touch-icon", sizes: "76x76", url: "/favicon/apple-icon-76x76.png" },
      { rel: "apple-touch-icon", sizes: "114x114", url: "/favicon/apple-icon-114x114.png" },
      { rel: "apple-touch-icon", sizes: "120x120", url: "/favicon/apple-icon-120x120.png" },
      { rel: "apple-touch-icon", sizes: "144x144", url: "/favicon/apple-icon-144x144.png" },
      { rel: "apple-touch-icon", sizes: "152x152", url: "/favicon/apple-icon-152x152.png" },
      { rel: "apple-touch-icon", sizes: "180x180", url: "/favicon/apple-icon-180x180.png" },

      // Favicon Icons
      { rel: "icon", type: "image/ico", url: "/favicon/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon/favicon-16x16.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "96x96", url: "/favicon/favicon-96x96.png" }
    ],
    other: [
      { rel: "apple-touch-icon-precomposed", url: "/favicon/apple-icon-precomposed.png" }
    ]
  },
  manifest: "/favicon/manifest.json"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var origFetch = window.fetch;
                window.fetch = function() {
                  return origFetch.apply(this, arguments).then(function(response) {
                    try {
                      var cacheLog = response.headers.get('x-cache-log');
                      if (cacheLog) {
                        console.log("%c" + decodeURIComponent(cacheLog), "color: #0ea5e9; font-weight: bold; background: #0f172a; padding: 6px 10px; border-radius: 6px; line-height: 1.5; font-family: monospace;");
                      }
                    } catch (e) {}
                    return response;
                  });
                };
              })();
            `
          }}
        />
      </body>
    </html>
  );
}
