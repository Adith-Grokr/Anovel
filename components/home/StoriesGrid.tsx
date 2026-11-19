// "Stay updated with village stories": Groundy's news grid — 2 wide cards, then 4 small cards.
import Image from "next/image";
import Link from "next/link";
import { Heart, Share2 } from "lucide-react";
import { SectionHeading } from "@/components/site/ui";
import { stories } from "@/lib/mock/data";
import type { Story } from "@/lib/types";

const tagColour: Record<Story["tag"], string> = {
  export: "bg-orange",
  farming: "bg-olive",
  craft: "bg-plum",
  village: "bg-[#4f7ea6]",
};

function WideCard({ story, liked }: { story: Story; liked?: boolean }) {
  return (
    <article className="flex min-h-[190px] overflow-hidden bg-cream">
      <Link href="/stories" className="relative w-1/2 shrink-0 sm:w-[55%]">
        <Image src={story.image} alt="" fill sizes="(min-width: 768px) 290px, 50vw" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
        <h3 className="text-[13px] font-bold leading-snug text-ink">
          <Link href="/stories" className="hover:text-olive">
            {story.title}
          </Link>
        </h3>
        <p className="mt-1 text-[10px] text-muted">{story.date}</p>
        <div className="mt-2 h-px bg-ink/15" />
        <p className="mt-2 line-clamp-4 text-[11px] leading-snug text-muted">{story.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="flex items-center gap-1.5 text-[11px] text-ink">
            <span className={`h-2.5 w-2.5 ${tagColour[story.tag]}`} aria-hidden />
            {story.tag}
          </span>
          <span className="flex items-center gap-2 text-ink" aria-hidden>
            <Share2 size={15} strokeWidth={2.2} />
            <Heart size={15} strokeWidth={2.2} className={liked ? "fill-ink" : ""} />
          </span>
        </div>
      </div>
    </article>
  );
}

function SmallCard({ story }: { story: Story }) {
  return (
    <Link href="/stories" className="group block">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={story.image}
          alt=""
          fill
          sizes="(min-width: 768px) 240px, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-2 line-clamp-2 text-[12px] font-bold leading-snug text-ink group-hover:text-olive">
        {story.title}
      </h3>
    </Link>
  );
}

export function StoriesGrid() {
  const [first, second, ...rest] = stories;
  return (
    <section className="bg-white px-4 py-10 sm:px-10 md:px-[76px] md:py-12">
      <SectionHeading
        title="Stay updated with village stories"
        subtitle="News from the clusters, the harvests and the people behind your products"
      />
      <div className="mt-7 grid gap-4 md:grid-cols-2 md:gap-5">
        {first && <WideCard story={first} />}
        {second && <WideCard story={second} liked />}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 md:mt-5 md:grid-cols-4">
        {rest.slice(0, 4).map((s) => (
          <SmallCard key={s.slug} story={s} />
        ))}
      </div>
    </section>
  );
}
