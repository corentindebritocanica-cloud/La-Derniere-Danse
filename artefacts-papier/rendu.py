"""Rend chaque artefact papier (*.dc.html) en PNG dans png/, à sa taille réelle (canvas.json), 2x."""
import json,re,os,glob,asyncio
from playwright.async_api import async_playwright
D=os.path.dirname(os.path.abspath(__file__))
boards=json.load(open(os.path.join(D,'canvas.json')))['boards']
imgs={os.path.splitext(f)[0]:f for f in os.listdir(os.path.join(D,'images'))}
PH="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><rect width='300' height='300' fill='%23d8ccb4'/><text x='150' y='150' font-size='16' text-anchor='middle' fill='%235a3e1b'>photo réelle (hors dépôt)</text></svg>"
def page(src):
    h=open(os.path.join(D,src),encoding='utf-8').read()
    helmet=re.search(r'<helmet>(.*?)</helmet>',h,re.S).group(1)
    body=re.search(r'</helmet>(.*?)</x-dc>',h,re.S).group(1)
    body=body.replace('{{rouge}}','#a8201a')
    body=re.sub(r'/_blob/([0-9a-f]{32})',lambda m:('images/'+imgs[m.group(1)]) if m.group(1) in imgs else PH,body)
    return '<!doctype html><html><head><meta charset="utf-8">'+helmet+'</head><body style="margin:0">'+body+'</body></html>'
async def main():
    os.makedirs(os.path.join(D,'png'),exist_ok=True)
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for src,bd in boards.items():
            tmp=os.path.join(D,'_tmp.html');open(tmp,'w',encoding='utf-8').write(page(src))
            pg=await b.new_page(viewport={'width':bd['w'],'height':bd['h']},device_scale_factor=2)
            await pg.goto('file://'+tmp);await pg.wait_for_timeout(1500)
            await pg.screenshot(path=os.path.join(D,'png',src.replace('.dc.html','.png')),clip={'x':0,'y':0,'width':bd['w'],'height':bd['h']})
            await pg.close()
        await b.close();os.remove(tmp)
asyncio.run(main())
