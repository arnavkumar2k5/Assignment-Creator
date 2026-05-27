import Link from 'next/link';
import { BookOpen, Zap, Shield, Clock, ArrowRight, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-paper/80 backdrop-blur-md border-b border-ink/8">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center">
              <BookOpen size={18} className="text-accent" />
            </div>
            <span className="font-display font-bold text-xl text-ink">AssessAI</span>
          </div>
          <Link href="/create"
            className="btn-primary text-sm py-2 px-5 flex items-center gap-2 group">
            Create Paper
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative">
        {/* Background decoration */}
        <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-ink/3 -translate-y-1/4 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 translate-y-1/4 -translate-x-1/3 blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-ink/5 border border-ink/10 rounded-full px-4 py-1.5 text-sm font-medium text-ink/70 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Powered by Advanced AI
          </div>

          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-ink leading-[1.05] mb-6 animate-fade-up stagger-1">
            Generate Exam<br />
            <span className="relative inline-block">
              Papers Instantly
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-accent rounded-full" />
            </span>
          </h1>

          <p className="text-xl text-ink/60 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up stagger-2 font-sans">
            Create professional, structured question papers with AI precision.
            Set your requirements and watch as intelligent generation produces exam-ready content in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up stagger-3">
            <Link href="/create"
              className="btn-accent text-lg py-4 px-8 flex items-center gap-3 group shadow-lg shadow-accent/20">
              <Zap size={20} />
              Start Creating
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/assignments" className="btn-secondary text-lg py-4 px-8">
              View Papers
            </Link>
          </div>
        </div>
      </section>

      {/* Feature preview */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Mock paper preview */}
          <div className="bg-white rounded-2xl shadow-xl border border-ink/8 overflow-hidden max-w-3xl mx-auto mb-24">
            <div className="bg-ink p-5 text-center">
              <p className="text-accent text-xs font-mono tracking-widest uppercase mb-1">Examination Paper</p>
              <h3 className="font-display text-white text-xl font-bold">Advanced Mathematics — Paper I</h3>
            </div>
            <div className="bg-cream p-4 flex items-center justify-between text-xs text-ink/60 font-mono border-b border-ink/8">
              <span>Date: May 26, 2025</span>
              <span>Total Questions: 15</span>
              <span>Total Marks: 50</span>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Section A — Multiple Choice', instruction: 'Attempt all 5 questions. Each carries 2 marks.', diff: 'easy' as const, color: 'emerald' },
                { label: 'Section B — Short Answer', instruction: 'Attempt any 5 of the 7 questions.', diff: 'medium' as const, color: 'yellow' },
                { label: 'Section C — Long Answer', instruction: 'Attempt any 2 of the 4 questions.', diff: 'hard' as const, color: 'red' },
              ].map((s) => (
                <div key={s.label} className="border border-ink/8 rounded-lg overflow-hidden">
                  <div className="bg-ink/5 px-4 py-2 flex items-center justify-between">
                    <span className="font-display font-semibold text-sm text-ink">{s.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full badge-${s.diff}`}>{s.diff}</span>
                  </div>
                  <div className="px-4 py-2">
                    <p className="text-xs text-ink/50 italic mb-2">{s.instruction}</p>
                    <div className="flex items-center gap-2 text-xs text-ink/40">
                      <div className="w-3 h-3 rounded-full bg-ink/10" />
                      <span>Questions generated...</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
            {[
              { value: '< 30s', label: 'Generation Time' },
              { value: '10+', label: 'Question Types' },
              { value: '3', label: 'Difficulty Levels' },
              { value: '100%', label: 'Structured JSON' },
            ].map((stat) => (
              <div key={stat.label} className="card text-center">
                <div className="font-display text-3xl font-bold text-ink mb-1">{stat.value}</div>
                <div className="text-sm text-ink/50">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap size={24} />,
                title: 'AI-Powered Generation',
                desc: 'Groq & OpenAI integration generates contextually relevant, academically rigorous questions instantly.',
              },
              {
                icon: <Shield size={24} />,
                title: 'Structured & Validated',
                desc: 'Every response is parsed, validated, and stored as structured JSON — never raw LLM output.',
              },
              {
                icon: <Clock size={24} />,
                title: 'Real-time Updates',
                desc: 'WebSocket-powered live status updates keep you informed as your paper generates in the queue.',
              },
            ].map((f) => (
              <div key={f.title} className="card group hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-ink/5 rounded-xl flex items-center justify-center mb-4 text-ink group-hover:bg-ink group-hover:text-accent transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed font-sans">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="fill-accent text-accent" />
            ))}
          </div>
          <h2 className="font-display text-4xl font-bold text-paper mb-4">
            Ready to create your first paper?
          </h2>
          <p className="text-paper/60 mb-8 font-sans">
            Configure your requirements and let AI do the heavy lifting.
          </p>
          <Link href="/create" className="btn-accent py-4 px-10 text-lg inline-flex items-center gap-3 group">
            <Zap size={20} />
            Create Paper Now
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink/8 py-8 px-6 text-center text-sm text-ink/40 font-sans">
        <div className="flex items-center justify-center gap-2 mb-1">
          <BookOpen size={14} className="text-ink/30" />
          <span className="font-display font-semibold text-ink/50">AssessAI</span>
        </div>
        <p>AI-powered examination paper generation</p>
      </footer>
    </div>
  );
}
