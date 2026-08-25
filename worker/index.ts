interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>
  }
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url)
    if (url.pathname === '/') url.pathname = '/index.html'
    return env.ASSETS.fetch(new Request(url, request))
  },
}
