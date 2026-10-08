from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os
os.chdir(Path(__file__).resolve().parents[1] / 'dist')
ThreadingHTTPServer(('127.0.0.1', 4321), SimpleHTTPRequestHandler).serve_forever()
