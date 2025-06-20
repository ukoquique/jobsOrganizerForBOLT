import { Job } from '../types/Job';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Job endpoints
  async getJobs(): Promise<Job[]> {
    return this.request<Job[]>('/jobs');
  }

  async getJob(id: string): Promise<Job> {
    return this.request<Job>(`/jobs/${id}`);
  }

  async createJob(job: Omit<Job, 'id' | 'dateAdded' | 'responses'>): Promise<Job> {
    return this.request<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(job),
    });
  }

  async updateJob(id: string, job: Partial<Job>): Promise<Job> {
    return this.request<Job>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(job),
    });
  }

  async deleteJob(id: string): Promise<void> {
    return this.request<void>(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async updateJobStatus(id: string, status: Job['status']): Promise<Job> {
    return this.request<Job>(`/jobs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateJobNotes(id: string, notes: string): Promise<Job> {
    return this.request<Job>(`/jobs/${id}/notes`, {
      method: 'PATCH',
      body: JSON.stringify({ notes }),
    });
  }

  // Response endpoints
  async createResponse(response: {
    jobId: string;
    date: string;
    type: string;
    message: string;
    sender: string;
  }): Promise<any> {
    return this.request('/responses', {
      method: 'POST',
      body: JSON.stringify(response),
    });
  }

  async getJobResponses(jobId: string): Promise<any[]> {
    return this.request(`/responses/job/${jobId}`);
  }

  async deleteResponse(id: string): Promise<void> {
    return this.request<void>(`/responses/${id}`, {
      method: 'DELETE',
    });
  }

  // Import endpoint
  async importFromMarkdown(): Promise<{ count: number }> {
    return this.request<{ count: number }>('/import/markdown', {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();