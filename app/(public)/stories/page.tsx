import type { Metadata } from "next";
import { PageBanner } from "@/components/catalog/PageBanner";
import { StoryCardSmall, StoryCardWide } from "@/components/catalog/StoryCard";
import { ButtonLink, SectionHeading } from "@/components/site/ui";
import { stories } from "@/lib/mock/data";

export const metadata: Metadata = {
  title: "Stories from the villages | ANOVEL",
  description: "News and stories from ANOVEL's weavers, farmers and artisans, and the buyers who source from them.",
};

export default function StoriesPage() {
  const [featured, rest] = [stories.slice(0, 2), stories.slice(2)];

  return (
    <>
      <PageBanner
        title="Stories from the villages"
        subtitle="First export orders, harvest seasons and the crafts behind every product: news from the people ANOVEL works with."
        crumbs={[{ href: "/", label: "Home" }, { label: "Stories" }]}
        image="/images/rice-women.jpg"
      />

      <section className="px-4 py-10 sm:px-8 lg:px-12">
        <SectionHeading title="Latest news" subtitle="Straight from the loom, the field and the port" />

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {featured.map((s, i) => (
            <StoryCardWide key={s.slug} story={s} priority={i === 0} />
          ))}
        </div>

        {rest.length > 0 && (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {rest.map((s) => (
              <StoryCardSmall key={s.slug} story={s} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-cream px-4 py-10 text-center sm:px-8">
        <p className="font-hand text-3xl text-olive">Want your products in the next story?</p>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
          Source directly from these villages. Tell us what you need and ANOVEL handles the rest.
        </p>
        <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
          <ButtonLink href="/products">Browse products</ButtonLink>
          <ButtonLink href="/post-requirement" variant="orange">
            Post a requirement
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
