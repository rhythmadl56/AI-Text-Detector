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

  const analyzeText = (inputText: string) => {
    const words = inputText.trim().split(/\s+/)
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const avgWordsPerSentence = words.length / Math.max(sentences.length, 1)
    
    // Calculate unique words ratio
    const uniqueWords = new Set(words.map(w => w.toLowerCase()))
    const vocabularyRichness = uniqueWords.size / words.length

    // Calculate sentence length variance
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length)
    const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length
    const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / sentenceLengths.length
    const sentenceVariance = Math.sqrt(variance)

    // Detect AI patterns
    let aiScore = 0
    
    // Check for repetitive phrases
    const words_lower = words.map(w => w.toLowerCase())
    const wordFreq: { [key: string]: number } = {}
    words_lower.forEach(w => {
      wordFreq[w] = (wordFreq[w] || 0) + 1
    })
    const maxFreq = Math.max(...Object.values(wordFreq))
    if (maxFreq > words.length * 0.08) aiScore += 15

    // Check for perfect grammar patterns (AI indicator)
    const hasMultipleCommas = (inputText.match(/,/g) || []).length > sentences.length * 2
    if (hasMultipleCommas) aiScore += 10

    // Check for formal transitions (AI indicator)
    const formalTransitions = ['furthermore', 'moreover', 'in conclusion', 'consequently', 'therefore', 'nevertheless']
    const transitionCount = formalTransitions.filter(t => inputText.toLowerCase().includes(t)).length
    if (transitionCount > 2) aiScore += 15

    // Vocabulary richness indicator - very high richness can indicate AI
    if (vocabularyRichness > 0.85) aiScore += 15
    else if (vocabularyRichness < 0.5) aiScore -= 10

    // Very uniform sentence length can indicate AI
    if (sentenceVariance < 3) aiScore += 20
    else if (sentenceVariance > 15) aiScore -= 10

    // Check for common AI markers
    const aiMarkers = ['as an ai', 'as a language model', 'i cannot', 'i should note', 'it is important to note']
    const markerCount = aiMarkers.filter(m => inputText.toLowerCase().includes(m)).length
    aiScore += markerCount * 25

    // Calculate perplexity (simplified)
    const perplexity = (Math.log(Math.max(uniqueWords.size, 1)) * (avgWordsPerSentence / 10)).toFixed(2)

    // Clamp AI score between 0 and 100
    aiScore = Math.max(0, Math.min(100, aiScore))

    // Determine explanation
    let explanation = ''
    if (aiScore > 70) {
      explanation = 'This text shows strong indicators of AI generation. High pattern consistency, formal transitions, and uniform structure suggest automated composition.'
    } else if (aiScore > 40) {
      explanation = 'This text exhibits mixed characteristics. Some AI-like patterns are present, but natural variations suggest partial human authorship or light AI assistance.'
    } else {
      explanation = 'This text displays authentic human writing patterns with natural sentence variation, organic vocabulary choices, and human-like imperfections.'
    }

    return {
      aiScore: Math.round(aiScore),
      perplexity: parseFloat(perplexity as string),
      sentenceVariance: sentenceVariance.toFixed(3),
      vocabularyRichness: vocabularyRichness.toFixed(3),
      explanation,
    }
  }

  const handleAnalyze = async () => {
    if (!text.trim()) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const analysisResults = analyzeText(text)
    setResults(analysisResults as any)
    setLoading(false)
  }

  const handleReset = () => {
    setResults(null)
    setText('')
  }

  const scoreColor = results && results.aiScore > 50 ? 'text-red-400' : results && results.aiScore < 50 ? 'text-green-400' : 'text-yellow-400'
  const barColor = results && results.aiScore > 50 ? 'bg-red-500' : results && results.aiScore < 50 ? 'bg-green-500' : 'bg-yellow-500'

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-sans">
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
                className="w-full h-64 p-6 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-white transition-all duration-300 ease-out focus:ring-1 focus:ring-white resize-none text-lg font-sans"
              />
              <Button
                onClick={handleAnalyze}
                disabled={!text.trim() || loading}
                className="w-full h-12 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* AI Score Section */}
                <div>
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-gray-400 text-sm font-medium">AI Likelihood Score</span>
                    <span className={`text-5xl font-bold transition-colors duration-500 ${scoreColor}`}>
                      {results.aiScore}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
                      style={{ width: `${results.aiScore}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-6 py-8 border-y border-zinc-800">
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: '100ms' }}>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-2 font-sans">Perplexity</p>
                    <p className="text-3xl font-bold font-sans">{results.perplexity}</p>
                  </div>
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: '200ms' }}>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-2 font-sans">Sentence Variance</p>
                    <p className="text-3xl font-bold font-sans">{results.sentenceVariance}</p>
                  </div>
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: '300ms' }}>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-2 font-sans">Vocabulary Richness</p>
                    <p className="text-3xl font-bold font-sans">{results.vocabularyRichness}</p>
                  </div>
                </div>

                {/* Summary */}
                <div className="animate-in fade-in duration-500" style={{ animationDelay: '400ms' }}>
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 font-sans">Analysis Summary</h3>
                  <p className="text-gray-400 leading-relaxed text-base font-sans">{results.explanation}</p>
                </div>
              </div>

              {/* Analyze Another Text Button */}
              <Button
                onClick={handleReset}
                className="w-full h-12 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200"
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
