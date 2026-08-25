import { cp, mkdir } from 'node:fs/promises'

await mkdir('dist/server', { recursive: true })
await cp('dist/dbt_rescue/index.js', 'dist/server/index.js')
