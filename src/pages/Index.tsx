import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layout, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import AuthButton from "@/components/auth/AuthButton";
import AuthModal from "@/components/auth/AuthModal";

const Index = () => {
  const [authOpen, setAuthOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-canvas">
      {/* Header */}
      <header className="p-6 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Layout className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Canvas CMS</h1>
          </div>
          <div className="flex items-center gap-4">
            <AuthButton />
            <Link to="/pages">
              <Button variant="outline" className="shadow-soft">
                Manage Pages
              </Button>
            </Link>
            <Link to="/studio">
              <Button className="shadow-medium">
                Open Studio
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-glow">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
            
            <h1 className="text-5xl font-bold mb-6 text-foreground leading-tight">
              Create Beautiful Pages
              <span className="bg-gradient-primary bg-clip-text text-transparent"> with AI</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              The visual CMS that combines live preview with AI-powered content generation. 
              Build stunning pages faster than ever before.
            </p>

            <div className="flex gap-4 justify-center flex-wrap mb-16">
              <Link to="/studio">
                <Button size="lg" className="shadow-medium">
                  <Zap className="h-5 w-5 mr-2" />
                  Start Creating
                </Button>
              </Link>
              <Link to="/ai-test">
                <Button variant="outline" size="lg" className="shadow-soft">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Try AI Generator
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="shadow-soft"
                onClick={() => setAuthOpen(true)}
              >
                Sign in
              </Button>
            </div>

            <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-soft">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Layout className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Live Canvas</h3>
                <p className="text-muted-foreground">
                  See your changes in real-time with our responsive live preview canvas.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-soft">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">AI Assistant</h3>
                <p className="text-muted-foreground">
                  Generate and edit content with our intelligent AI chat assistant.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-soft">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Templates</h3>
                <p className="text-muted-foreground">
                  Start fast with professional templates for any type of website.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
