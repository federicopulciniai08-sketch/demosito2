"""Server locale che applica header e cleanUrls di vercel.json, per provare il sito (CSP compresa) prima di pubblicarlo.
uso: python src/serve.py <porta> [--no-tt]   (--no-tt toglie le direttive Trusted Types, solo per i test con axe)"""
import json, os, re, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5530
NO_TT = '--no-tt' in sys.argv
cfg = json.load(open(os.path.join(ROOT, 'vercel.json'), encoding='utf-8'))


def to_regex(src):
    return re.compile('^' + src.replace('(.*)', '(.*)') + '$')


RULES = [(to_regex(r['source']), r['headers']) for r in cfg.get('headers', [])]


class H(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def translate_path(self, path):
        clean = path.split('?', 1)[0]
        full = super().translate_path(path)
        if cfg.get('cleanUrls') and not os.path.splitext(clean)[1] and clean not in ('/', '') and os.path.exists(full + '.html'):
            return full + '.html'
        return full

    def end_headers(self):
        path = self.path.split('?', 1)[0]
        for rx, headers in RULES:
            if rx.match(path):
                for h in headers:
                    v = h['value']
                    if NO_TT and h['key'].lower() == 'content-security-policy':
                        v = re.sub(r";\s*require-trusted-types-for[^;]*|;\s*trusted-types[^;]*", '', v)
                    self.send_header(h['key'], v)
        super().end_headers()

    def log_message(self, *a):
        pass


H.extensions_map.update({'.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.js': 'text/javascript'})
ThreadingHTTPServer(('127.0.0.1', PORT), H).serve_forever()
