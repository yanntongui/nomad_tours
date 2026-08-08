import { getHomepageContent, rowToHomepageContent } from "@/lib/server/homepage";
import { listApprovedTestimonials } from "@/lib/server/testimonials";
import { listDestinations } from "@/lib/server/destinations";
import { LandingPageClient } from "./LandingPageClient";

export default async function LandingPage() {
  const [contentRow, testimonials, destinations] = await Promise.all([
    getHomepageContent(),
    listApprovedTestimonials(),
    listDestinations(),
  ]);
  const content = rowToHomepageContent(contentRow);

  return <LandingPageClient content={content} testimonials={testimonials} destinations={destinations} />;
}
