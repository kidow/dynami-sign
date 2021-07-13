declare namespace NodeJS {
  interface Process {
    env: ProcessEnv
  }
  interface ProcessEnv {
    SUPABASE_URL: string
    SUPABASE_KEY: string
  }
}
