// Split auth layout: photo + handwritten quote on the left (desktop), cream form panel on the right.
import Image from "next/image";
import { Logo } from "@/components/site/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream lg:grid lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden lg:block">
        <Image
          src="/images/turmeric-farmers.jpg"
          alt="Turmeric farmers in an Indian village"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/10" />
        <div className="absolute left-10 top-10">
          <Logo size="md" />
        </div>
        <figure className="absolute inset-x-10 bottom-12 text-white">
          <blockquote className="font-hand text-4xl leading-snug xl:text-5xl">
            “From our village fields to buyers across the world, with a fair price for our work.”
          </blockquote>
          <figcaption className="mt-4 text-sm font-bold text-white/85">
            Turmeric farmers’ group · Nizamabad, Telangana
          </figcaption>
        </figure>
      </aside>

      <main className="flex min-h-screen flex-col px-4 py-8 sm:px-10">
        <div className="flex justify-center lg:hidden">
          <Logo size="md" />
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">{children}</div>
        <p className="text-center text-xs text-muted">© {new Date().getFullYear()} Anovel Technologies Private Limited</p>
      </main>
    </div>
  );
}
