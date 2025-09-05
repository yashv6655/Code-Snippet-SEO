export interface Snippet {
  id: string
  user_id: string
  code: string
  language?: string
  title?: string
  description?: string
  explanation?: string
  html_output?: string
  schema_markup?: Record<string, unknown>
  github_url?: string
  created_at: string
  updated_at: string
}

export interface GenerateRequest {
  code: string
  language?: string
}

export interface GenerateResponse {
  title: string
  description: string
  explanation: string
  html_output: string
  schema_markup: Record<string, unknown>
}