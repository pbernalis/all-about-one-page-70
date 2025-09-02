import InlineText from "@/components/editors/InlineText";

export default function FeaturesEditable({ data, schema, setSchema, readOnly }: any) {
  const items: Array<any> = data?.items ?? [
    { title: "Fast", description: "Feature description goes here." },
    { title: "Reliable", description: "Feature description goes here." },
    { title: "Secure", description: "Feature description goes here." }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div key={i} className="text-center p-6 rounded-xl border bg-card hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-primary mb-4">
                <InlineText
                  path={`/content/features/items/${i}/title`}
                  value={item?.title}
                  placeholder="Feature Title"
                  readOnly={readOnly}
                  schema={schema}
                  setSchema={setSchema}
                />
              </h3>
              <div className="text-muted-foreground">
                <InlineText
                  path={`/content/features/items/${i}/description`}
                  value={item?.description ?? item?.desc}
                  placeholder="Feature description goes here."
                  readOnly={readOnly}
                  schema={schema}
                  setSchema={setSchema}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}