import type { Metadata, Viewport } from "next";
import { ViewTransitions } from "next-view-transitions";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/playfair-display/600.css";
import "./globals.css";
import DotField from "@/components/DotField";
import AnnotateCursor from "@/components/AnnotateCursor";
import Providers from "@/components/Providers";
import { site } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Adam Calliste — UX and product designer",
    template: "%s · Adam Calliste",
  },
  description:
    "Adam Calliste designs clear, honest products and builds them as working prototypes you can try. Case studies in fintech, travel and wellbeing.",
  openGraph: {
    title: "Adam Calliste — UX and product designer",
    description: "Clear, honest products, built as working prototypes you can try.",
    images: ["/projects/atlas.webp"],
  },
};

export const viewport: Viewport = {
  // Dark is the default whatever the device setting, so the browser chrome matches it.
  themeColor: "#0d0f13",
};

// Dark is the default. A saved choice wins, set before paint so there is no flash.
const themeScript = `try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=(t==='light'||t==='dark')?t:'dark'}catch(e){document.documentElement.dataset.theme='dark'}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ViewTransitions>
      <html lang="en-GB" data-theme="dark" suppressHydrationWarning>
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        </head>
        <body>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Providers>
            <DotField />
            <AnnotateCursor />
            {children}
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  );
}
