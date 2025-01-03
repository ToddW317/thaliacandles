import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '../.env') })

// Import and run the specified script
const scriptName = process.argv[2]
if (!scriptName) {
  console.error('Please specify a script name')
  process.exit(1)
}

import(`./${scriptName}.ts`)
  .catch(error => {
    console.error('Error running script:', error)
    process.exit(1)
  }) 