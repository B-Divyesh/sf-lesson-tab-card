# Demo sandbox

## Entry point

- Production: `https://lesson-tab-card.sociobot.in/demo`
- Local: `http://127.0.0.1:5173/demo`
- Query alias: `/?demo=1`

The first screen already contains a complete G to C chord-change exercise. It has a chord grid, fingering, capo value, six tab strings, and one practice note.

## Isolation

Demo syntax lives only in the current page's JavaScript memory. It does not use local storage, IndexedDB, cookies, or a backend. The real draft uses `lesson-tab-card:source:v1`; demo mode never reads or writes that key. The sample is bundled in the application and remains available offline.

## Reset and exit

“Reset demo” restores the bundled sample. “Start for real” leaves demo mode and loads the separate real draft, if one exists. Leaving or reloading the demo discards demo edits.

The paid worksheet can be exported with the bundled sample in demo mode. This does not activate a real license or write license state.
