import { motion } from "framer-motion";
import { Brain, Bookmark, Sparkles, FolderOpen, Search, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Bookmark,
    title: "Smart Bookmarks",
    description: "Save links with notes, tags, and personal insights — not just URLs.",
  },
  {
    icon: Sparkles,
    title: "AI Summaries",
    description: "Get instant summaries, key takeaways, and difficulty ratings for any link.",
  },
  {
    icon: FolderOpen,
    title: "Collections",
    description: "Organize knowledge into learning paths like 'React Prep' or 'System Design'.",
  },
  {
    icon: Search,
    title: "Instant Search",
    description: "Find anything by title, tags, or notes in milliseconds.",
  },
  {
    icon: Zap,
    title: "Recall Mode",
    description: "Flashcard-style revision for interview prep. Flip cards, test yourself.",
  },
  {
    icon: Brain,
    title: "Code Vault",
    description: "Save code snippets with explanations. Your personal Stack Overflow.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-hidden">
      {/* Glow orbs */}
      <div className="fixed top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Brain className="h-7 w-7 text-primary" />
          <span className="font-mono font-bold text-lg text-foreground">BrainVault</span>
        </div>
        <Button
          onClick={() => navigate("/auth")}
          className="bg-primary text-primary-foreground font-mono font-semibold hover:shadow-[var(--neon-glow)] transition-shadow"
        >
          Open App
        </Button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-mono text-primary">Your Developer Second Brain</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-mono leading-tight tracking-tight mb-6">
            Don't just save links.{" "}
            <span className="gradient-text">Build your second brain.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Turn random bookmarks into structured knowledge you can actually use.
            AI-powered summaries, smart collections, and flashcard recall for interview prep.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-primary text-primary-foreground font-mono font-bold text-base px-8 py-6 hover:shadow-[var(--neon-glow)] transition-all"
            >
              Get Started — It's Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-mono text-base px-8 py-6 border-border text-foreground hover:bg-secondary"
            >
              See How It Works
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-mono font-bold mb-4">
            Everything you need to <span className="neon-text">remember</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Built for developers who consume tons of content but forget it all.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="glass-hover rounded-xl p-6 group cursor-default"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-mono font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-20 text-center">
        <div className="glass rounded-2xl p-10 neon-border">
          <h2 className="text-2xl sm:text-3xl font-mono font-bold mb-4">
            Ready to build your vault?
          </h2>
          <p className="text-muted-foreground mb-6">
            Start saving, organizing, and recalling knowledge today.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-primary text-primary-foreground font-mono font-bold px-8 py-6 hover:shadow-[var(--neon-glow)] transition-all"
          >
            Launch BrainVault
          </Button>
        </div>
      </section>
    </div>
  );
}
