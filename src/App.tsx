import { useState } from 'react'
import './App.css'
import type { VocabularyEntry } from './types/VocabularyEntry'
import { sampleWords } from './data/sampleWords'

function App() {
  // State for the romaji query input
  const [query, setQuery] = useState('')
  const [selectedEntry, setSelectedEntry] = useState<VocabularyEntry | null>(null)

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
        {results.map((w) => {
          const isSelected = selectedEntry?.id === w.id
          return (
            <li
              key={w.id}
              onClick={() => setSelectedEntry(w)}
              style={{
                border: '1px solid #ddd',
                padding: 12,
                marginBottom: 8,
                borderRadius: 6,
                cursor: 'pointer',
                background: isSelected ? '#f0f8ff' : '#fff',
                boxShadow: isSelected ? '0 0 0 2px #90cdf4' : 'none',
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 600 }}>{w.kanji}</div>
              <div style={{ color: '#444' }}>{w.readingKana} — {w.romaji}</div>
              <div style={{ marginTop: 6 }}>{w.meaningEnglish}</div>
              <div style={{ marginTop: 6, fontSize: 12, color: '#666' }}>JLPT: {w.jlptLevel}</div>
            </li>
          )
        })}
      </ul>

      {results.length === 0 && (
        <div style={{ marginTop: 16 }}>No matching entries found. ☹️</div>
      )}

      {selectedEntry && (
        <section style={{ marginTop: 24, padding: 16, border: '1px solid #ccc', borderRadius: 8, background: '#fafafa' }}>
          <h2 style={{ marginTop: 0 }}>Anki card preview</h2>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{selectedEntry.kanji}</div>
          <div style={{ marginTop: 8 }}>
            <strong>Reading & Meaning:</strong> {selectedEntry.readingKana} — {selectedEntry.meaningEnglish}
          </div>
          <div style={{ marginTop: 12, fontSize: 16 }}>{selectedEntry.exampleJapanese}</div>
          <div style={{ marginTop: 8, color: '#555' }}>{selectedEntry.exampleEnglish}</div>
        </section>
      )}
    </div>
  )
}

export default App
