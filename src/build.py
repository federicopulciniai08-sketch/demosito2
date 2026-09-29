"""Genera le pagine del sito da src/pages/*.html, con intestazione, pedice e icone in comune.

uso: python src/build.py
Le pagine generate (index.html, chi-siamo.html, ...) finiscono nella cartella principale:
per modificare un testo si cambia il file in src/pages e si rilancia lo script.
"""
import io
import os

SRC = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(SRC)
VERSION = '20260929b'  # cambia a ogni pubblicazione, così i browser ricaricano CSS e JS


def read(*parts):
    return io.open(os.path.join(SRC, *parts), encoding='utf-8').read()


# ---------------------------------------------------------------- dati in comune
TEL = 'tel:+393487309497'
WA = 'https://wa.me/393487309497?text=Ciao%20Martina%21%20Vorrei%20qualche%20informazione%20per%20una%20festa.'
MAIL = 'mailto:langolodelcompleanno@gmail.com'
ADDR_Q = 'L%27Angolo%20del%20Compleanno%2C%20Viale%20Europa%201C%2C%2065015%20Montesilvano%20PE'
MAPS_DIR = f'https://www.google.com/maps/dir/?api=1&amp;destination={ADDR_Q}'
MAPS_PLACE = f'https://www.google.com/maps/search/?api=1&amp;query={ADDR_Q}'
IG = 'https://www.instagram.com/langolodelcompleanno/'
FB = 'https://www.facebook.com/langolodelcompleanno/'
AMAZON = 'https://www.amazon.it/s?me=A20ZVTYC19J53L'
EXT = '<span class="sr-only"> (si apre in una nuova scheda)</span>'
STAR = '<svg class="i"><use href="#i-star"/></svg>'
STARS = f'<span class="rating-stars" aria-hidden="true">{STAR * 5}</span>'
ARROW = '<svg class="i i-arrow" aria-hidden="true"><use href="#i-arrow-right"/></svg>'

TOKENS = {
    'tel': TEL, 'wa': WA, 'mail': MAIL, 'maps_dir': MAPS_DIR, 'maps_place': MAPS_PLACE,
    'ig': IG, 'fb': FB, 'amazon': AMAZON, 'ext': EXT, 'stars': STARS, 'arrow': ARROW,
}

NAV = [('home', './', 'Home'), ('chi-siamo', 'chi-siamo', 'Chi siamo'),
       ('catalogo', 'catalogo', 'Catalogo'), ('contatti', 'contatti', 'Contattaci')]


def head(title, desc, body_class):
    cls = f' class="{body_class}"' if body_class else ''
    return f'''<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta name="theme-color" content="#FCF1EC">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="it_IT">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta name="robots" content="noindex, nofollow, noarchive, noimageindex">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="preload" href="fonts/redhat-display-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="fonts/redhat-text-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="style.css?v={VERSION}">
  <script>document.documentElement.classList.add('js')</script>
  <script src="script.js?v={VERSION}" defer></script>
</head>
<body{cls}>
'''


def header(active):
    items = []
    for key, href, label in NAV:
        cur = ' aria-current="page"' if key == active else ''
        items.append(f'          <li><a href="{href}"{cur}>{label}</a></li>')
    items = '\n'.join(items)
    return f'''<a class="skip" href="#main">Vai al contenuto</a>

<header class="site-header" data-header>
  <div class="wrap header-inner">
    <a class="brand" href="./" aria-label="L'Angolo del Compleanno, vai alla home">
      <span class="brand-name" aria-hidden="true">L<svg class="brand-balloon" viewBox="0 0 20 36" focusable="false"><use href="#logo-balloon"/></svg>Angolo</span>
      <span class="brand-sub" aria-hidden="true">del Compleanno</span>
    </a>
    <nav class="nav" aria-label="Navigazione principale">
      <div class="menu" id="menu" data-menu>
        <ul class="nav-list">
{items}
        </ul>
        <div class="menu-extra">
          <p class="status" data-status-wrap><span class="dot" aria-hidden="true"></span><span data-status>Viale Europa 1C, Montesilvano</span></p>
          <div class="menu-actions">
            <a class="btn btn-ink js-whatsapp" href="{WA}" target="_blank" rel="noopener"><svg class="i" aria-hidden="true"><use href="#i-whatsapp"/></svg>WhatsApp{EXT}</a>
            <a class="btn btn-line js-phone" href="{TEL}"><svg class="i" aria-hidden="true"><use href="#i-phone"/></svg>Chiama</a>
          </div>
        </div>
      </div>
      <a class="btn btn-primary btn-sm nav-cta" href="contatti#preventivo">Preventivo gratuito</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" data-menu-btn>
        <span class="sr-only">Apri il menu</span>
        <span class="menu-icon" aria-hidden="true"><i></i><i></i></span>
      </button>
    </nav>
  </div>
</header>
'''


def footer():
    pages = '\n'.join(f'          <li><a href="{href}">{label}</a></li>' for _, href, label in NAV)
    return f'''<footer class="site-footer">
  <div class="wrap footer-top">
    <div class="footer-brand">
      <p class="footer-name">L<svg class="brand-balloon" viewBox="0 0 20 36" aria-hidden="true" focusable="false"><use href="#logo-balloon"/></svg>Angolo<span>del Compleanno</span></p>
      <p>Palloncini, allestimenti e articoli per feste in Viale Europa, a Montesilvano.</p>
      <a class="btn btn-primary" href="contatti#preventivo">Chiedi un preventivo gratuito</a>
    </div>
    <nav class="footer-col" aria-labelledby="ft-pages">
      <h2 class="footer-title" id="ft-pages">Pagine</h2>
      <ul class="footer-links">
{pages}
      </ul>
    </nav>
    <div class="footer-col">
      <h2 class="footer-title">Negozio</h2>
      <p>Viale Europa 1C<br>65015 Montesilvano (PE)</p>
      <p>Lunedì–sabato 9:30–13:00<br>e 16:30–19:30, giovedì solo mattina.<br>Domenica chiuso.</p>
      <a class="footer-more js-directions" href="{MAPS_DIR}" target="_blank" rel="noopener">Indicazioni stradali{EXT}</a>
    </div>
    <div class="footer-col">
      <h2 class="footer-title">Contatti</h2>
      <ul class="footer-links">
        <li><a class="js-phone" href="{TEL}">348 730 9497</a></li>
        <li><a class="js-whatsapp" href="{WA}" target="_blank" rel="noopener">WhatsApp{EXT}</a></li>
        <li><a class="js-email" href="{MAIL}">langolodelcompleanno<wbr>@gmail.com</a></li>
      </ul>
      <p class="footer-social">
        <a href="{IG}" target="_blank" rel="noopener" aria-label="Instagram (si apre in una nuova scheda)"><svg class="i" aria-hidden="true"><use href="#i-instagram"/></svg></a>
        <a href="{FB}" target="_blank" rel="noopener" aria-label="Facebook (si apre in una nuova scheda)"><svg class="i" aria-hidden="true"><use href="#i-facebook"/></svg></a>
      </p>
    </div>
  </div>
  <div class="wrap footer-base">
    <p>Anteprima dimostrativa non ufficiale, realizzata per presentare una proposta di sito a L'Angolo del Compleanno.</p>
    <p class="footer-legal"><a href="note-legali">Note legali e privacy</a><a href="accessibilita">Accessibilità</a></p>
  </div>
</footer>
'''


MBAR = f'''
<div class="mbar" data-mbar aria-hidden="true">
  <a class="btn btn-line js-phone" href="{TEL}" tabindex="-1"><svg class="i" aria-hidden="true"><use href="#i-phone"/></svg>Chiama</a>
  <a class="btn btn-primary js-whatsapp" href="{WA}" tabindex="-1" target="_blank" rel="noopener"><svg class="i" aria-hidden="true"><use href="#i-whatsapp"/></svg>Scrivici su WhatsApp{EXT}</a>
</div>
'''

PAGES = [
    # file, modello, titolo, descrizione, voce di menu attiva, classe del body, barra mobile
    ('index.html', 'home.html',
     "Anteprima sito · L'Angolo del Compleanno, Montesilvano",
     'Negozio di palloncini a Montesilvano (PE): allestimenti con palloncini per battesimi, comunioni, compleanni ed eventi. Consegna anche in giornata e montaggio sul posto.',
     'home', '', True),
    ('chi-siamo.html', 'chi-siamo.html',
     "Chi siamo · Anteprima sito L'Angolo del Compleanno",
     "Martina e il suo negozio di palloncini in Viale Europa, a Montesilvano: come è nato L'Angolo del Compleanno e come lavora.",
     'chi-siamo', '', True),
    ('catalogo.html', 'catalogo.html',
     "Catalogo · Anteprima sito L'Angolo del Compleanno",
     'Allestimenti con palloncini per ogni festa: archi, numeri e lettere, pareti di palloncini, pannelli personalizzati, scritte in polistirolo e articoli per feste.',
     'catalogo', '', True),
    ('contatti.html', 'contatti.html',
     "Contattaci · Anteprima sito L'Angolo del Compleanno",
     'Indirizzo, orari e contatti del negozio in Viale Europa 1C a Montesilvano, e il modulo per chiedere un preventivo gratuito su WhatsApp.',
     'contatti', '', True),
    ('note-legali.html', 'note-legali.html',
     "Note legali e privacy · Anteprima sito L'Angolo del Compleanno",
     "Note legali e informativa privacy dell'anteprima dimostrativa del sito di L'Angolo del Compleanno.",
     None, 'legal-page', False),
    ('accessibilita.html', 'accessibilita.html',
     "Dichiarazione di accessibilità · Anteprima sito L'Angolo del Compleanno",
     "Dichiarazione di accessibilità dell'anteprima dimostrativa del sito di L'Angolo del Compleanno.",
     None, 'legal-page', False),
]


def render(template):
    body = read('pages', template)
    body = body.replace('{{setup_art}}', read('partials', 'setup-art.html').strip())
    body = body.replace('{{map_art}}', read('partials', 'map-art.html').strip())
    for k, v in TOKENS.items():
        body = body.replace('{{' + k + '}}', v)
    assert '{{' not in body, f'segnaposto non risolto in {template}'
    return body


def main():
    sprite = read('partials', 'sprite.html').strip()
    for out, template, title, desc, active, body_class, mbar in PAGES:
        html = (head(title, desc, body_class) + '\n' + sprite + '\n\n' + header(active) + '\n'
                + render(template).strip() + '\n\n' + footer() + (MBAR if mbar else '') + '\n</body>\n</html>\n')
        io.open(os.path.join(ROOT, out), 'w', encoding='utf-8', newline='\n').write(html)
        print('scritto', out, len(html))


if __name__ == '__main__':
    main()
