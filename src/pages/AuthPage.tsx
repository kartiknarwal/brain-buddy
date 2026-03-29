import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your email to confirm your account!");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background grid-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="orb w-[500px] h-[500px] top-[-200px] left-[-100px] bg-primary/6" />
      <div className="orb w-[400px] h-[400px] bottom-[-150px] right-[-100px] bg-accent/6" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2.5 cursor-pointer mb-5"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center neo-raised">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold text-xl text-foreground tracking-tight">BrainVault</span>
          </div>
          <h1 className="font-bold text-2xl text-foreground mb-2 tracking-tight">
            {isLogin ? "Welcome back" : "Create your vault"}
          </h1>
          <p className="text-sm text-muted-foreground font-light">
            {isLogin ? "Sign in to access your second brain" : "Start building your second brain"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass neon-border rounded-3xl p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="pl-10 bg-secondary/60 border-border/60 text-sm h-12 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="pl-10 bg-secondary/60 border-border/60 text-sm h-12 rounded-xl"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full pill-btn bg-primary text-primary-foreground font-semibold h-12 text-sm"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-light"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
