import { motion } from "framer-motion";
import { Brain, Bookmark, Sparkles, FolderOpen, Search, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Bookmark,
    title: "Smart Bookmarks",
    description: "Save links with notes, tags, and personal insights — not just URLs.",
    glow: "from-primary/10 to-transparent",
  },
  {
    icon: Sparkles,
    title: "AI Summaries",
    description: "Get instant summaries, key takeaways, and difficulty ratings for any link.",
    glow: "from-accent/10 to-transparent",
  },
  {
    icon: FolderOpen,
    title: "Collections",
    description: "Organize knowledge into learning paths like 'React Prep' or 'System Design'.",
    glow: "from-primary/10 to-transparent",
  },
  {
    icon: Search,
    title: "Instant Search",
    description: "Find anything by title, tags, or notes in milliseconds.",
    glow: "from-accent/10 to-transparent",
  },
  {
    icon: Zap,
    title: "Recall Mode",
    description: "Flashcard-style revision for interview prep. Flip cards, test yourself.",
    glow: "from-primary/10 to-transparent",
  },
  {
    icon: Brain,
    title: "Code Vault",
    description: "Save code snippets with explanations. Your personal Stack Overflow.",
    glow: "from-accent/10 to-transparent",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="orb w-[600px] h-[600px] top-[-250px] left-[-200px] bg-primary/8" />
      <div className="orb w-[500px] h-[500px] bottom-[-200px] right-[-150px] bg-accent/8" />
      <div className="orb w-[300px] h-[300px] top-[40%] right-[10%] bg-primary/5" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center neo-raised">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <span className="font-semibold text-lg text-foreground tracking-tight">BrainVault</span>
        </div>
        <Button
          onClick={() => navigate("/auth")}
          className="pill-btn bg-primary text-primary-foreground font-semibold"
        >
          Open App
        </Button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass neo-raised mb-10">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary/90">Your Developer Second Brain</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-7">
            Don't just save links.{" "}
            <span className="gradient-text">Build your second brain.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Turn random bookmarks into structured knowledge you can actually use.
            AI-powered summaries, smart collections, and flashcard recall for interview prep.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="pill-btn bg-primary text-primary-foreground font-bold text-base px-10 py-7 animate-glow-pulse"
            >
              Get Started — It's Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="pill-btn text-base px-10 py-7 border-border text-foreground hover:bg-secondary/60"
            >
              See How It Works
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-28">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            Everything you need to <span className="neon-text">remember</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-light">
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
              className="glass-hover holo-shimmer rounded-2xl p-7 group cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.glow} border border-primary/10 flex items-center justify-center mb-5 neo-raised group-hover:animate-glow-pulse transition-all`}>
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-[15px]">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24 text-center">
        <div className="glass holo-shimmer rounded-3xl p-12 neon-border relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight">
              Ready to build your vault?
            </h2>
            <p className="text-muted-foreground mb-8 font-light">
              Start saving, organizing, and recalling knowledge today.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="pill-btn bg-primary text-primary-foreground font-bold px-10 py-7 animate-glow-pulse"
            >
              Launch BrainVault
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
