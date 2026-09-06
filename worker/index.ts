interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>
  }
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url)
    if (['/demo', '/demo/', '/frame', '/frame/'].includes(url.pathname)) url.pathname = '/'
    return env.ASSETS.fetch(new Request(url, request))
  },
}
