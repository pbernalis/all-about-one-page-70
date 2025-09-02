import type { Operation } from "fast-json-patch";

const ALLOWED = new Set([
  "hero","features","cta","logo_cloud","testimonials","pricing_tiered","feature_comparison",
  "faq_accordion","post_header","post_body","product_gallery","testimonials_marquee","careers_grid",
  "team","legal_content","not_found","story","values"
]);

const ALIAS: Record<string,string> = {
  pricing:"pricing_tiered", price:"pricing_tiered", plans:"pricing_tiered",
  faq:"faq_accordion", faqs:"faq_accordion", questions:"faq_accordion",
  contact:"cta", contact_us:"cta", newsletter:"cta", share:"cta", "auth-forms":"cta", get_started:"cta",
  "feature-detail":"features", feature_detail:"features", "feature-grid":"features", feature_grid:"features",
  capabilities:"features", process:"features", steps:"features", how_it_works:"features",
  metrics:"features", benefits:"features", problem:"features", solution:"features", results:"features",
  "search-bar":"features", "search-results":"features", search_results:"features", locations:"features",
  comparisons:"feature_comparison", compare:"feature_comparison",
  integrations:"logo_cloud", logos:"logo_cloud", partners:"logo_cloud",
  testimonials:"testimonials", reviews:"testimonials", quotes:"testimonials",
  "testimonial-spotlight":"testimonials_marquee", wall_of_love:"testimonials_marquee",
  about:"story", company:"story", our_story:"story", story:"story",
  principles:"values", our_values:"values", culture:"values",
  "blog-list":"post_body", post_list:"post_body", "related-posts":"post_body", related_posts:"post_body",
  "post-hero":"post_header", "post-body":"post_body", post_body:"post_body", "author-bio":"team", author_bio:"team",
  "project-grid":"product_gallery", projects:"product_gallery",
  "job-listings":"careers_grid", jobs:"careers_grid",
  legal:"legal_content", "legal-body":"legal_content", legal_body:"legal_content", terms:"legal_content", privacy:"legal_content",
  "empty-state":"not_found", empty_state:"not_found"
};

const mapId = (id: string) => {
  const mapped = ALIAS[id] ?? id;
  return ALLOWED.has(mapped) ? mapped : null;
};

export function sanitizeSectionOps(ops: Operation[]): Operation[] {
  const out: Operation[] = [];

  for (const op of ops) {
    // normalize /sections full add/replace
    if (op.path === "/sections" && (op.op === "add" || op.op === "replace") && Array.isArray(op.value)) {
      const mapped = (op.value as unknown[])
        .map(String)
        .map(mapId)
        .filter((v): v is string => !!v);

      const seen = new Set<string>();
      const unique = mapped.filter((x) => (seen.has(x) ? false : (seen.add(x), true)));

      out.push({ ...op, value: unique });
      continue;
    }

    // normalize /content/<id> paths (remap or drop)
    const m = op.path.match(/^\/content\/([^/]+)(.*)$/);
    if (m) {
      const [, id, rest] = m;
      const good = mapId(id);
      if (!good) continue; // drop unknown section content
      const newPath = good === id ? op.path : `/content/${good}${rest}`;
      out.push({ ...op, path: newPath });
      continue;
    }

    out.push(op);
  }

  return out;
}