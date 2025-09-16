import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-documentation-improvements.ts';
import '@/ai/flows/generate-initial-documentation.ts';
import '@/ai/flows/summarize-code-functionality.ts';