import React, { useState } from 'react'
import './App.css'

// Beginner-friendly type for a vocabulary item
type VocabularyEntry = {
  id: number
  kanji: string
  readingKana: string
  romaji: string
  meaningEnglish: string
  jlptLevel: string
}

// Hardcoded sample words (10 entries), including ambiguous romaji like "hashi" and "kami"
const sampleWords: VocabularyEntry[] = [
  { id: 1, kanji: '箸', readingKana: 'はし', romaji: 'hashi', meaningEnglish: 'chopsticks', jlptLevel: 'N5' },
  { id: 2, kanji: '橋', readingKana: 'はし', romaji: 'hashi', meaningEnglish: 'bridge', jlptLevel: 'N4' },
  { id: 3, kanji: '紙', readingKana: 'かみ', romaji: 'kami', meaningEnglish: 'paper', jlptLevel: 'N5' },
  { id: 4, kanji: '神', readingKana: 'かみ', romaji: 'kami', meaningEnglish: 'god; deity', jlptLevel: 'N2' },
  { id: 5, kanji: '水', readingKana: 'みず', romaji: 'mizu', meaningEnglish: 'water', jlptLevel: 'N5' },
  { id: 6, kanji: '火', readingKana: 'ひ', romaji: 'hi', meaningEnglish: 'fire', jlptLevel: 'N5' },
  { id: 7, kanji: '行く', readingKana: 'いく', romaji: 'iku', meaningEnglish: 'to go', jlptLevel: 'N5' },
  { id: 8, kanji: '食べる', readingKana: 'たべる', romaji: 'taberu', meaningEnglish: 'to eat', jlptLevel: 'N5' },
  { id: 9, kanji: '人', readingKana: 'ひと', romaji: 'hito', meaningEnglish: 'person', jlptLevel: 'N5' },
  { id: 10, kanji: '先生', readingKana: 'せんせい', romaji: 'sensei', meaningEnglish: 'teacher', jlptLevel: 'N5' },
]

function App(): JSX.Element {
  // State for the romaji query input
  const [query, setQuery] = useState('')

  // Normalize the query for case-insensitive comparison
  const normalized = query.trim().toLowerCase()

  // Filter by romaji; if query is empty this returns all entries because
  // every string includes the empty string.
  const results = sampleWords.filter((entry) =>
    entry.romaji.toLowerCase().includes(normalized),
  )

  return (
    <div className="app-root" style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Japanese Vocabulary Search (prototype)</h1>

      <label htmlFor="romaji-input" style={{ display: 'block', marginBottom: 8 }}>
        Type romaji to search (e.g. hashi, kami):
      </label>
      <input
        id="romaji-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter romaji..."
        style={{ padding: 8, width: 320, marginBottom: 16 }}
      />

      <div style={{ marginBottom: 12 }}>
        Showing {results.length} of {sampleWords.length} entries
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {results.map((w) => (
          <li
            key={w.id}
            style={{
              border: '1px solid #ddd',
              padding: 12,
              marginBottom: 8,
              borderRadius: 6,
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 600 }}>{w.kanji}</div>
            <div style={{ color: '#444' }}>{w.readingKana} — {w.romaji}</div>
            <div style={{ marginTop: 6 }}>{w.meaningEnglish}</div>
            <div style={{ marginTop: 6, fontSize: 12, color: '#666' }}>JLPT: {w.jlptLevel}</div>
          </li>
        ))}
      </ul>

      {results.length === 0 && (
        <div style={{ marginTop: 16 }}>No matching entries found. ☹️</div>
      )}
    </div>
  )
}

export default App
