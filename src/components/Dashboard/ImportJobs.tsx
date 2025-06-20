import React, { useState } from 'react';
import { apiService } from '../../services/api';

interface ImportJobsProps {
  onImportSuccess: () => void;
}

export const ImportJobs: React.FC<ImportJobsProps> = ({ onImportSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleImport = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await apiService.importFromMarkdown();
      setSuccessMessage(`${result.count} new jobs were successfully imported.`);
      onImportSuccess(); // Callback to refresh the job list
    } catch (err) { 
      setError(err instanceof Error ? err.message : 'An unknown error occurred during import.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-sm">
      <h3 className="font-semibold text-text-primary mb-2">Import Jobs</h3>
      <p className="text-text-secondary mb-3">
        Import new jobs from the markdown source file. Duplicates will be skipped.
      </p>
      <button
        onClick={handleImport}
        disabled={isLoading}
        className="w-full bg-accent/10 text-accent px-4 py-2 rounded-lg hover:bg-accent/20 disabled:opacity-50 transition-colors text-center"
      >
        {isLoading ? 'Importing...' : 'Import from Markdown'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
      {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}
    </div>
  );
};
