module.exports = {
  devIndicators: {
    autoPrerender: false
  },
  images: {
    domains: ['localhost']
  },
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY
  }
}
