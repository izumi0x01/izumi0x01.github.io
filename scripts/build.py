"""Build the static HOME and Sphinx Wiki into dist/."""
from pathlib import Path
from html import escape
import os, shutil, subprocess, sys
import yaml
ROOT = Path(__file__).resolve().parents[1]
os.chdir(ROOT)
OUT = ROOT / os.environ.get('BUILD_DIR', 'dist')
# Only replace the generated output directory; source files are preserved.
if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir()
base = '/' + os.environ.get('BASE_PATH', '').strip('/')
base = base.rstrip('/')
def url(path): return base + '/' + path.lstrip('/')
def e(value): return escape(str(value), quote=True)
def load(name): return yaml.safe_load((ROOT / 'data' / name).read_text())
profile, research, papers = load('profile.yml'), load('research.yml'), load('publications.yml')
def link(href, label): return f'<a href="{e(href)}">{e(label)}</a>'
def contacts():
    return ' · '.join(link('mailto:'+profile[k] if k=='email' else profile[k], label) if profile.get(k) else e(label+'：未設定') for k,label in [('email','Email'),('github','GitHub'),('orcid','ORCID'),('scholar','Google Scholar')])
sections = ['<section id="profile"><div class="profile"><img class="portrait" src="'+e(url('assets/'+(profile['photo'] or 'profile-placeholder.svg')))+'" alt="'+('研究者の写真' if profile['photo'] else '写真未設定のプレースホルダー')+'"><div><h1>'+e(profile['name'])+'</h1><p>'+e(profile['japanese_name'])+'</p><p>'+'<br>'.join(e(profile[k]) for k in ['university','laboratory','degree'])+'</p><p>'+e(', '.join(profile['fields']))+'</p><p>'+contacts()+'</p></div></div><p class="note">未設定項目とサンプル研究・論文は本人の実績を示すものではありません。</p></section>', '<section id="interests"><h2>Research Interests</h2><p>'+e(profile['intro'])+'</p></section>']
projects = '<section id="research"><h2>Research Projects</h2>'
for item in research:
    projects += '<article><h3>'+e(item['title'])+'</h3><img src="'+e(url('assets/'+item['image']))+'" alt="'+e(item['title'])+'の概念図"><p>'+e(item['description'])+'</p>'+link(url('wiki/'+item['wiki']), '関連Wiki')
    for ident in item.get('publication_ids', []):
        projects += ' · '+link('#publication-'+ident, '関連論文')
    projects += '</article>'
sections.append(projects+'</section>')
publications = '<section id="publications"><h2>Publications</h2>'
for kind,label in [('journal','Journal Papers'),('conference','Conference Papers'),('domestic','Domestic Conferences'),('other','Other Publications')]:
    publications += '<h3>'+label+'</h3>'
    matching = sorted([p for p in papers if p['type']==kind],key=lambda p:p['year'],reverse=True)
    if not matching: publications += '<p>未登録</p>'
    for p in matching:
        publications += '<article id="publication-'+e(p['id'])+'"><strong>'+e(p['title'])+'</strong><p>'+e(p['authors'])+'<br>'+e(p['venue'])+' · '+e(p['year'])+'</p>'
        if p.get('doi'): publications += link('https://doi.org/'+p['doi'],'DOI')+' '
        if p.get('pdf'): publications += link(p['pdf'],'PDF')
        if p.get('bibtex'): publications += '<details><summary>BibTeX</summary><pre>'+e(p['bibtex'])+'</pre></details>'
        publications += '</article>'
sections.append(publications+'</section>')
for key,title in [('education','Education / Experience'),('awards','Awards')]:
    sections.append('<section><h2>'+title+'</h2><ul>'+''.join('<li>'+e(x)+'</li>' for x in profile[key])+'</ul></section>')
sections.append('<section id="contact"><h2>Contact</h2><p>'+contacts()+'</p></section>')
(OUT/'index.html').write_text('<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+e(profile['name'])+' | Research Portfolio</title><link rel="stylesheet" href="'+e(url('assets/css/home.css'))+'"></head><body><header><nav aria-label="Global navigation">'+link(url(''),'HOME')+link(url('wiki/'),'Wiki')+'</nav></header><main>'+''.join(sections)+'</main><footer>'+e(profile['name'])+' · Research Portfolio</footer></body></html>')
shutil.copytree(ROOT/'assets',OUT/'assets')
for p in (ROOT/'public').glob('*'):
    if p.is_file(): shutil.copy2(p,OUT/'assets'/p.name)
subprocess.run([sys.executable,'-m','sphinx','-W','--keep-going','-b','html','wiki',str(OUT/'wiki')],check=True)
(OUT/'.nojekyll').touch()
print('Built HOME + Wiki in dist/')
