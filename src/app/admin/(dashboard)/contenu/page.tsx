import { listAllBlogPosts } from "@/lib/server/blog";
import { listAllTestimonials, listApprovedTestimonials } from "@/lib/server/testimonials";
import { getHomepageContent, listHomepageVersions, rowToHomepageContent } from "@/lib/server/homepage";
import { getCmsSeoSettings } from "@/lib/server/cms-settings";
import { listDestinations } from "@/lib/server/destinations";
import { RequireSuperAdmin } from "@/components/admin/RequireSuperAdmin";
import { ContenuClient } from "./ContenuClient";

export default async function ContenuPage() {
  const [
    posts,
    testimonials,
    approvedTestimonials,
    homepageContent,
    homepageVersions,
    seoSettings,
    destinations,
  ] = await Promise.all([
    listAllBlogPosts(),
    listAllTestimonials(),
    listApprovedTestimonials(),
    getHomepageContent(),
    listHomepageVersions(),
    getCmsSeoSettings(),
    listDestinations(),
  ]);

  return (
    <RequireSuperAdmin>
      <ContenuClient
        posts={posts}
        testimonials={testimonials}
        approvedTestimonials={approvedTestimonials}
        homepageContent={rowToHomepageContent(homepageContent)}
        homepageVersions={homepageVersions}
        seoSettings={seoSettings}
        destinations={destinations}
      />
    </RequireSuperAdmin>
  );
}
