import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userPrompt, availableTemplates, options = {}, schema } = await req.json();

    // Default options
    const {
      locale = 'en',
      tone = 'professional, friendly',
      goal = 'lead-gen'
    } = options;

    // Build context for Gemini
    const templatesContext = availableTemplates.map((tpl: any) => 
      `- ${tpl.slug}: "${tpl.title}" with sections [${tpl.sections.join(', ')}]`
    ).join('\n');

    const systemPrompt = `You are an expert web designer and copywriter. Your task is to generate website content based on user prompts.

AVAILABLE TEMPLATES:
${templatesContext}

RULES:
1. Pick the best template that matches the user's request (or use schema.layoutId if provided: ${schema?.layoutId || 'none'})
2. Generate content for canonical sections: hero, features, pricing, testimonials, contact
3. Return ONLY valid JSON, no code fences or markdown
4. Use ${locale === 'el' ? 'Greek' : 'English'} language
5. Tone should be: ${tone}
6. Goal: ${goal}

RESPONSE FORMAT:
{
  "templateSlug": "chosen-template-slug",
  "content": {
    "hero": {
      "headline": "Main headline",
      "subheadline": "Supporting text",
      "primaryCta": "Button text",
      "secondaryCta": "Secondary button text"
    },
    "features": {
      "headline": "Features section title",
      "items": [
        { "title": "Feature 1", "description": "Feature description", "icon": "icon-name" },
        { "title": "Feature 2", "description": "Feature description", "icon": "icon-name" },
        { "title": "Feature 3", "description": "Feature description", "icon": "icon-name" }
      ]
    },
    "pricing": {
      "headline": "Pricing section title",
      "plans": [
        { "name": "Basic", "price": "€19", "features": ["Feature 1", "Feature 2"], "cta": "Get Started" },
        { "name": "Pro", "price": "€49", "features": ["Everything in Basic", "Feature 3", "Feature 4"], "cta": "Start Free Trial" }
      ]
    },
    "testimonials": {
      "headline": "What our customers say",
      "items": [
        { "name": "John Doe", "role": "CEO at Company", "content": "Testimonial text", "avatar": "/placeholder-avatar.jpg" }
      ]
    },
    "contact": {
      "headline": "Get in touch",
      "description": "Contact description",
      "email": "hello@example.com",
      "phone": "+30 210 123 4567"
    }
  },
  "reason": "Why this template was chosen",
  "alternatives": ["alternative-template-1", "alternative-template-2"]
}`;

    const userMessage = `Generate website content for: "${userPrompt}"`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt + '\n\nUSER REQUEST:\n' + userMessage }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;

    // Clean up the response and parse JSON
    let cleanedText = generatedText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    }
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    const result = JSON.parse(cleanedText);

    console.log('Template generation successful:', result.templateSlug);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-template-generator:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      templateSlug: availableTemplates?.[0]?.slug || 'services-overview',
      content: {
        hero: {
          headline: 'Welcome to Our Platform',
          subheadline: 'Experience the future of web development',
          primaryCta: 'Get Started',
          secondaryCta: 'Learn More'
        }
      },
      reason: 'Fallback due to error: ' + error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});