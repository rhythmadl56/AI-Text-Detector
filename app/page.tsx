'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
    await new Promise((resolve) => setTimeout(resolve, 2000))

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

  const handleReset = () => {
    setResults(null)
    setText('')
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-4">
            Text Authenticity
          </h1>
          <p className="text-xl text-gray-400">
            Analyze if text is human-written or AI-generated
          </p>
        </div>

        {/* Main Container */}
        <div className="space-y-6">
          {/* Input or Results */}
          {!results ? (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here..."
                className="w-full h-64 p-6 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-white focus:ring-0 resize-none text-lg"
              />
              <Button
                onClick={handleAnalyze}
                disabled={!text.trim() || loading}
                className="w-full h-12 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Text'
                )}
              </Button>
            </>
          ) : (
            <>
              {/* Results Display */}
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* AI Score Section */}
                <div>
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-gray-400 text-sm font-medium">AI Likelihood Score</span>
                    <span className="text-5xl font-bold">{results.aiScore}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-500"
                      style={{ width: `${results.aiScore}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-6 py-8 border-y border-zinc-800">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Perplexity</p>
                    <p className="text-3xl font-bold">{results.perplexity}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Sentence Variance</p>
                    <p className="text-3xl font-bold">{results.sentenceVariance}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Vocabulary Richness</p>
                    <p className="text-3xl font-bold">{results.vocabularyRichness}</p>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Analysis Summary</h3>
                  <p className="text-gray-400 leading-relaxed text-base">{results.explanation}</p>
                </div>
              </div>

              {/* Analyze Another Text Button */}
              <Button
                onClick={handleReset}
                className="w-full h-12 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Analyze Another Text
              </Button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
