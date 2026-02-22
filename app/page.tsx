'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{
    aiScore: number
    perplexity: number
    sentenceVariance: number
    vocabularyRichness: number
    explanation: string
  } | null>(null)

  const handleAnalyze = async () => {
    if (!text.trim()) return

    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock results based on input
    const mockResults = {
      aiScore: Math.floor(Math.random() * 40) + 20,
      perplexity: (Math.random() * 200 + 50).toFixed(2),
      sentenceVariance: (Math.random() * 0.5 + 0.3).toFixed(3),
      vocabularyRichness: (Math.random() * 0.4 + 0.5).toFixed(3),
      explanation:
        'This text exhibits characteristics consistent with human writing, with natural sentence flow and varied vocabulary usage.',
    }

    setResults(mockResults as any)
    setLoading(false)
  }

  const characterCount = text.length

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 dark:bg-slate-950">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-balance">
            Text Authenticity Analyzer
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Analyze text authenticity with advanced AI metrics. Detect AI-generated content instantly.
          </p>
        </div>

        {/* Input Section */}
        <Card className="p-6 md:p-8 bg-card border border-border shadow-sm mb-6">
          <div className="mb-4">
            <label htmlFor="textarea" className="text-sm font-medium text-foreground mb-2 block">
              Paste your text here
            </label>
            <textarea
              id="textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text you want to analyze..."
              className="w-full min-h-48 p-4 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0 resize-none"
            />
          </div>

          {/* Character Counter */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-muted-foreground">
              {characterCount.toLocaleString()} characters
            </span>
          </div>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={!text.trim() || loading}
            className="w-full h-11 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Text'
            )}
          </Button>
        </Card>

        {/* Results Section */}
        {results && !loading && (
          <Card className="p-6 md:p-8 bg-card border border-border shadow-sm animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Analysis Results</h2>

            <div className="space-y-6">
              {/* AI Likelihood Score */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-foreground">AI Likelihood Score</label>
                  <span className="text-2xl font-bold text-accent">{results.aiScore}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-accent h-full rounded-full transition-all duration-300"
                    style={{ width: `${results.aiScore}%` }}
                  />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {/* Perplexity */}
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Perplexity Score
                  </p>
                  <p className="text-2xl font-bold text-foreground">{results.perplexity}</p>
                </div>

                {/* Sentence Variance */}
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Sentence Variance
                  </p>
                  <p className="text-2xl font-bold text-foreground">{results.sentenceVariance}</p>
                </div>

                {/* Vocabulary Richness */}
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Vocabulary Richness
                  </p>
                  <p className="text-2xl font-bold text-foreground">{results.vocabularyRichness}</p>
                </div>
              </div>

              {/* Explanation */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3">Analysis Summary</h3>
                <p className="text-foreground leading-relaxed">{results.explanation}</p>
              </div>

              {/* Reset Button */}
              <Button
                onClick={() => {
                  setResults(null)
                  setText('')
                }}
                variant="outline"
                className="w-full"
              >
                Analyze Another Text
              </Button>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {!results && !loading && (
          <div className="text-center text-muted-foreground py-12">
            <p>Enter text above to begin analysis</p>
          </div>
        )}
      </div>
    </main>
  )
}
