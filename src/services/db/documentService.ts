
/**
 * This is a re-export file for document services
 * It exports functions from the document/ directory for backwards compatibility
 */

export { getDocument, saveDocument } from './document';

// Log a deprecation warning (only in development)
if (process.env.NODE_ENV === 'development') {
  console.warn(
    '[DEPRECATED] Direct imports from documentService.ts are deprecated. ' +
    'Please import these functions from src/services/db/document instead.'
  );
}
