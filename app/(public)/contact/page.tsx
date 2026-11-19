import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { HandshakeIcon, PlaneIcon, SackIcon } from "@/components/site/HandIcons";

export const metadata: Metadata = {
  title: "Contact — ANOVEL",
  description: "Talk to the ANOVEL team in Hyderabad by WhatsApp, email or the contact form.",
};

const WHATSAPP = "https://wa.me/919010325138";

const audiences = [
  {
    Icon: PlaneIcon,
    title: "I'm a buyer",
    text: "Sourcing handloom, crafts, spices or grains? Post a requirement and get matched in 48h.",
    href: "/post-requirement",
    cta: "Post a requirement",
  },
  {
    Icon: SackIcon,
    title: "I'm a producer",
    text: "Farmer, weaver, artisan, SHG or FPO? Join free. We help you with papers and orders.",
    href: "/register?role=producer",
    cta: "Join free",
  },
  {
    Icon: HandshakeIcon,
    title: "Partnerships",
    text: "NGOs, government missions, logistics and finance partners: let’s build village supply chains together.",
    href: "mailto:partners@anovel.in",
    cta: "partners@anovel.in",
  },
];

export default function ContactPage() {
  return (
    <div className="px-4 py-10 sm:px-8 sm:py-14">
      <div className="text-center">
        <h1 className="heading-swash font-hand text-4xl leading-tight sm:text-5xl">Let’s talk</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted sm:text-base">
          The quickest way to reach us is WhatsApp. We reply in English, Hindi and Telugu.
        </p>
      </div>

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {audiences.map(({ Icon, title, text, href, cta }) => (
          <li key={title} className="flex flex-col rounded-2xl bg-cream p-5">
            <span className="blob flex h-16 w-16 items-center justify-center bg-sage text-olive-dark">
              <Icon size={38} />
            </span>
            <h2 className="mt-3 font-hand text-2xl">{title}</h2>
            <p className="mt-1 flex-1 text-sm text-muted">{text}</p>
            <Link href={href} className="mt-3 text-sm font-bold text-olive underline-offset-4 hover:underline">
              {cta} →
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-5">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="brush flex items-center gap-4 bg-[#25D366] p-5 text-white shadow-md transition hover:brightness-95"
          >
            <MessageCircle size={40} className="shrink-0" />
            <span>
              <span className="block font-hand text-3xl leading-none">Chat on WhatsApp</span>
              <span className="mt-1 block text-sm font-bold text-white/90">+91 90103 25138</span>
            </span>
          </a>

          <div className="rounded-2xl bg-cream p-5">
            <h2 className="font-hand text-2xl text-olive-dark">Visit us</h2>
            <p className="mt-2 flex items-start gap-2 text-sm">
              <MapPin size={18} className="mt-0.5 shrink-0 text-orange" />
              <span>
                <b>Anovel Technologies Private Limited</b>
                <br />
                Hyderabad, Telangana, India
              </span>
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm">
              <Mail size={18} className="shrink-0 text-orange" />
              <a href="mailto:hello@anovel.in" className="font-bold text-olive hover:underline">
                hello@anovel.in
              </a>
            </p>
            <p className="mt-3 text-xs text-muted">Mon–Sat, 9:30 am – 6:30 pm IST</p>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
