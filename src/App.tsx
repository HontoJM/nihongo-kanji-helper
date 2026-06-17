import { useState } from 'react'
import './App.css'
import type { VocabularyEntry } from './types/VocabularyEntry'
import { sampleWords } from './data/sampleWords'

function App() {
  // State for the romaji query input
  const [query, setQuery] = useState('')
  const [selectedEntry, setSelectedEntry] = useState<VocabularyEntry | null>(null)
  const [exportQueue, setExportQueue] = useState<VocabularyEntry[]>([])
  const [queueMessage, setQueueMessage] = useState<string>('')

  // Normalize the query for case-insensitive comparison
  const normalized = query.trim().toLowerCase()

  // Filter by romaji; if query is empty this returns all entries because
  // every string includes the empty string.
  const results = sampleWords.filter((entry) =>
    entry.romaji.toLowerCase().includes(normalized),
  )

  // Add entry to export queue (prevent duplicates by kanji)
  const addToQueue = (entry: VocabularyEntry) => {
    const alreadyExists = exportQueue.some((item) => item.kanji === entry.kanji)
    if (alreadyExists) {
      setQueueMessage('Already in queue')
      setTimeout(() => setQueueMessage(''), 2000)
    } else {
      setExportQueue([...exportQueue, entry])
      setQueueMessage('')
    }
  }

  // Remove entry from export queue
  const removeFromQueue = (kanji: string) => {
    setExportQueue(exportQueue.filter((item) => item.kanji !== kanji))
  }

  // Export queue as TSV
  const exportAsTSV = () => {
    const rows = exportQueue.map((entry) => {
      const readingMeaning = `${entry.readingKana} — ${entry.meaningEnglish}`
      const example = `${entry.exampleJapanese}<br>→ ${entry.exampleEnglish}`
      return [entry.kanji, readingMeaning, example]
    })

    // Export only card data, no header row
    const tsvContent = rows.map((row) => row.join('\t')).join('\n')

    // Generate timestamp in AAMMJJHHMM format (YYMMDDHHmm)
    const now = new Date()
    const year = String(now.getFullYear()).slice(-2)
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hour = String(now.getHours()).padStart(2, '0')
    const minute = String(now.getMinutes()).padStart(2, '0')
    const timestamp = `${year}${month}${day}${hour}${minute}`

    const blob = new Blob([tsvContent], { type: 'text/tab-separated-values' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `anki-cards-${timestamp}.tsv`
    link.click()
    URL.revokeObjectURL(url)
  }

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
        onChange={(e) => {
          setQuery(e.target.value)
          setSelectedEntry(null)
        }}
        placeholder="Enter romaji..."
        style={{ padding: 8, width: 320, marginBottom: 16 }}
      />

      <div style={{ marginBottom: 12 }}>
        Showing {results.length} of {sampleWords.length} entries
      </div>

      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
        {results.map((w) => {
          const isSelected = selectedEntry?.id === w.id
          return (
            <li
              key={w.id}
              onClick={() => setSelectedEntry(w)}
              style={{
                border: '1px solid #ddd',
                padding: 12,
                borderRadius: 6,
                cursor: 'pointer',
                background: isSelected ? '#f0f8ff' : '#fff',
                boxShadow: isSelected ? '0 0 0 2px #90cdf4' : 'none',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 36, fontWeight: 600, marginBottom: 8 }}>{w.kanji}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{w.romaji}</div>
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

          <button
            onClick={() => addToQueue(selectedEntry)}
            style={{
              marginTop: 16,
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Add to export queue
          </button>

          {queueMessage && (
            <div style={{ marginTop: 8, fontSize: 14, color: '#666' }}>
              {queueMessage}
            </div>
          )}
        </section>
      )}

      {exportQueue.length > 0 && (
        <section style={{ marginTop: 24, padding: 16, border: '1px solid #999', borderRadius: 8, background: '#f9f9f9' }}>
          <h2 style={{ marginTop: 0 }}>Export queue ({exportQueue.length})</h2>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            {exportQueue.map((entry) => (
              <li
                key={entry.kanji}
                style={{
                  border: '1px solid #ddd',
                  padding: 12,
                  marginBottom: 8,
                  borderRadius: 4,
                  background: '#fff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 600 }}>{entry.kanji}</div>
                    <div style={{ marginTop: 6, color: '#444' }}>
                      {entry.readingKana} — {entry.meaningEnglish}
                    </div>
                    <div style={{ marginTop: 6, fontSize: 14 }}>{entry.exampleJapanese}</div>
                    <div style={{ marginTop: 4, fontSize: 14, color: '#555' }}>{entry.exampleEnglish}</div>
                  </div>
                  <button
                    onClick={() => removeFromQueue(entry.kanji)}
                    style={{
                      padding: '4px 12px',
                      backgroundColor: '#f44336',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 12,
                      marginLeft: 8,
                    }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={exportAsTSV}
            style={{
              marginTop: 12,
              padding: '10px 20px',
              backgroundColor: '#2196F3',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Export TSV
          </button>
        </section>
      )}
    </div>
  )
}

export default App
