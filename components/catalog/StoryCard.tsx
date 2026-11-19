// Story cards in the pattern of Groundy's news section:
// wide cards (image left, cream text panel right) and small cards (image top, title below).
import Image from "next/image";
import { Heart, Share2 } from "lucide-react";
import type { Story } from "@/lib/types";

const TAG_STYLE: Record<Story["tag"], { label: string; dot: string; text: string }> = {
  village: { label: "village life", dot: "bg-olive", text: "text-olive" },
  craft: { label: "craft", dot: "bg-plum", text: "text-plum" },
  export: { label: "export", dot: "bg-orange", text: "text-orange" },
  farming: { label: "farming", dot: "bg-[#4f7ea8]", text: "text-[#4f7ea8]" },
};

function Tag({ tag }: { tag: Story["tag"] }) {
  const t = TAG_STYLE[tag];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${t.text}`}>
      <span className={`h-2.5 w-2.5 ${t.dot}`} aria-hidden />
      {t.label}
    </span>
  );
}

function Actions() {
  return (
    <span className="flex items-center gap-2 text-plum" aria-hidden>
      <Share2 className="h-4 w-4" />
      <Heart className="h-4 w-4" />
    </span>
  );
}

export function StoryCardWide({ story, priority = false }: { story: Story; priority?: boolean }) {
  return (
    <article className="grid min-w-0 grid-cols-1 overflow-hidden bg-cream sm:grid-cols-[58%_1fr]">
      <div className="relative aspect-[16/10] sm:aspect-auto sm:min-h-[220px]">
        <Image
          src={story.image}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 58vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-col p-4">
        <h3 className="font-bold leading-snug text-ink">{story.title}</h3>
        <p className="mt-1 text-[11px] text-muted">{story.date}</p>
        <p className="mt-3 border-t border-cream-2 pt-3 text-xs leading-relaxed text-ink/80">{story.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <Tag tag={story.tag} />
          <Actions />
        </div>
      </div>
    </article>
  );
}

export function StoryCardSmall({ story }: { story: Story }) {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden bg-cream">
      <div className="relative aspect-[4/3]">
        <Image
          src={story.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-sm font-bold leading-snug text-ink">{story.title}</h3>
        <p className="mt-1 text-[11px] text-muted">{story.date}</p>
        <p className="mt-2 text-xs leading-relaxed text-ink/80">{story.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <Tag tag={story.tag} />
          <Actions />
        </div>
      </div>
    </article>
  );
}
