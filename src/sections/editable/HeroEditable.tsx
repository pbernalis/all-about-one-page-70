import InlineText from "@/components/editors/InlineText";

export default function HeroEditable({ data, theme, schema, setSchema, readOnly }: any) {
  return (
    <section className="py-16 text-center bg-gradient-to-br from-primary/10 to-primary/5">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">
          <InlineText
            path="/content/hero/title"
            value={data?.title}
            placeholder="Your Amazing Headline"
            readOnly={readOnly}
            schema={schema}
            setSchema={setSchema}
            className="inline-block"
          />
        </h1>

        <div className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          <InlineText
            path="/content/hero/subtitle"
            value={data?.subtitle}
            placeholder="A compelling subtitle that explains your value proposition."
            readOnly={readOnly}
            schema={schema}
            setSchema={setSchema}
          />
        </div>

        <div className="mt-8">
          <a className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors">
            <InlineText
              path="/content/hero/cta"
              value={data?.cta}
              placeholder="Get Started"
              readOnly={readOnly}
              schema={schema}
              setSchema={setSchema}
              className="inline-block"
            />
          </a>
        </div>
      </div>
    </section>
  );
}