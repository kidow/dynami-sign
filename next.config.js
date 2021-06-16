module.exports = {
  async redirects() {
    return [
      {
        source: '/sign',
        destination: '/api/sign',
        permanent: true
      }
    ]
  }
}
