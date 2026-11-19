import Link from "next/link";
import { Logo } from "./Logo";
import { categories } from "@/lib/mock/data";

export function Footer() {
  return (
    <footer className="bg-plum text-white/85">
      <div className="gutter grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo size="sm" />
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            ANOVEL connects the production power of India&apos;s villages with the demand of the world.
          </p>
        </div>
        <div>
          <h3 className="font-hand text-2xl text-white">Products</h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/products?category=${c.slug}`} className="hover:text-orange">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-hand text-2xl text-white">ANOVEL</h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li><Link href="/how-it-works" className="hover:text-orange">How it works</Link></li>
            <li><Link href="/villages" className="hover:text-orange">Our villages</Link></li>
            <li><Link href="/stories" className="hover:text-orange">Stories</Link></li>
            <li><Link href="/about" className="hover:text-orange">About us</Link></li>
            <li><Link href="/register?role=producer" className="hover:text-orange">Sell on ANOVEL</Link></li>
            <li><Link href="/post-requirement" className="hover:text-orange">Post a requirement</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-hand text-2xl text-white">Talk to us</h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>Hyderabad, Telangana, India</li>
            <li><a href="https://wa.me/919010325138" className="hover:text-orange">WhatsApp: +91 90103 25138</a></li>
            <li><Link href="/contact" className="hover:text-orange">Contact form</Link></li>
          </ul>
        </div>
      </div>
      <div className="gutter flex flex-col gap-2 border-t border-white/15 py-4 text-xs text-white/60 sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} ANOVEL Technologies. Demo build with sample data.</span>
        <span className="flex gap-4">
          <span>Terms</span>
          <span>Privacy</span>
          <span>Refunds</span>
          <span>Grievance Officer</span>
        </span>
      </div>
    </footer>
  );
}
