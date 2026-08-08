import { NewsletterSubscriber } from "@/lib/admin/types";

export const NEWSLETTER_SUBSCRIBERS: NewsletterSubscriber[] = [
  {
    id: "news-1",
    email: "sophie.martin@example.com",
    name: "Sophie Martin",
    source: "Footer",
    subscribedAt: "2026-01-12",
    status: "ACTIVE",
  },
  {
    id: "news-2",
    email: "kevin.dubois@example.com",
    name: "Kevin Dubois",
    source: "Popup accueil",
    subscribedAt: "2026-02-03",
    status: "ACTIVE",
  },
  {
    id: "news-3",
    email: "amina.diallo@example.com",
    source: "Footer",
    subscribedAt: "2026-02-20",
    status: "ACTIVE",
  },
  {
    id: "news-4",
    email: "j.lefevre@example.com",
    name: "Julien Lefèvre",
    source: "Article blog",
    subscribedAt: "2026-03-05",
    status: "DISABLED",
  },
  {
    id: "news-5",
    email: "grace.osei@example.com",
    name: "Grace Osei",
    source: "Footer",
    subscribedAt: "2026-04-18",
    status: "ACTIVE",
  },
];
