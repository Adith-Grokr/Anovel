// Full-width page layout: header, page sections and footer span the whole screen.
// Section backgrounds run edge to edge; their content stays in a centred
// 1200px column on wide screens (see `.site-main` rules in globals.css).
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="site-main flex-1">{children}</main>
      <Footer />
    </div>
  );
}
