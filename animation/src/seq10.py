"""Séquence 10 — la semaine volée (chapitre 10)."""
from scenes import *

JOURS = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE']

def page_calendrier(c, x, y, jour, a=255, angle=0):
    papier(c, x, y, 220, 150, a, angle, '#fbf6ea')
    c.drawRect(skia.Rect.MakeXYWH(0, 0, 220, 44), P(ROUGE, a))
    texte(c, jour, 110, 32, font('titre', 28), PAPIER, a, 'center')
    texte(c, 'décembre 1925', 110, 110, font('italique', 22), ENCRE, a, 'center')
    c.restore()

# 10.1 — lundi, mardi, mercredi
def p101(c, t, f):
    fond_cases(c, '#3a2a20')
    def lundi(c, w, h):
        boulangerie(c, w * 1.3, h * 1.4, t, 255, 200)
        figure(c, w * 0.3, h * 1.25, 700, 'celestin', pose(regard=0.6, expr='sourire', md=(1.9, 1.4)), 1, 255, False)
        figure(c, w * 0.62, h * 1.25, 640, 'louise_jour', pose(regard=-0.6, expr='sourire', md=(1.7, 1.4), rougir=0.5), -1, 255, False)
        figure(c, w * 0.9, h * 1.2, 600, 'fabre', pose(regard=-0.6, expr='sourire', md=(1.6, 1.0), mg=(1.6, 1.1)), -1, 255, False)
        croissant(c, w * 0.46, h * 0.72, 30); croissant(c, w * 0.5, h * 0.74, 28)
        if t > 1.2:
            scintille(c, w * 0.48, h * 0.7, 26, 255 * env(t, 1.2, 3.0, 0.2))
    def mardi(c, w, h):
        hangar_latecoere(c, w * 1.6, h * 1.4, t, 255, 0)
        figure(c, w * 0.35, h * 1.3, 760, 'celestin', pose(regard=0.6, expr='rire', md='leve', main_d=None, mg=(1.8, 1.2)), 1, 255, False)
        papier(c, w * 0.48, h * 0.25, 220, 150, 255, -6, '#f6f2e6')
        trait(c, courbe([(20, 100), (60, 50), (140, 40), (200, 90)], 6), 4, BLEU)
        c.restore()
        c.drawRect(skia.Rect.MakeXYWH(w * 0.72, 0, w * 0.28, h), P('#cfe0e6', 120))
        figure(c, w * 0.86, h * 1.2, 620, 'louise_manteau', pose(regard=-0.6, expr='sourire', md='coeur'), -1, 255, False)
        texte(c, '(derrière la verrière)', w * 0.86, h - 20, font('main', 26), ENCRE, 255, 'center')
    def mercredi(c, w, h):
        studio_solange(c, w * 1.3, h * 1.4, t, 255, 100)
        ph = t * 1.6
        couple(c, w * 0.3, w * 0.48, h * 1.0, 560, ('celestin', 'louise_jour'), 'ferme', pose(regard=0.7, expr='tendre', **pas_de_valse(t)),
               pose(regard=-0.6, expr='sourire', jupe=0.3, **pas_de_valse(t)))
        frappe = (t * 1.6) % 1 < 0.15
        figure(c, w * 0.82, h * 1.04, 600, 'solange', pose(regard=-0.5, expr='rire', main_d='canne', md=(0.8, 1.4 + (0.25 if frappe else 0)), mg='hanches'), -1, 255)
        if frappe:
            onomatopee(c, 'TOC', w * 0.86, h * 0.92, 44, 8, ENCRE, PAPIER, 255)
        texte(c, '« leçon de piano »', 20, h - 20, font('main', 30), ENCRE, 255)
    case(c, (24, 24, 620, 1032), lundi, t, lin(t, 0.0, 0.4), 'haut')
    case(c, (668, 24, 600, 1032), mardi, t, lin(t, 2.4, 2.8), 'haut')
    case(c, (1292, 24, 604, 1032), mercredi, t, lin(t, 4.8, 5.2), 'haut')
    for k, (j, t0) in enumerate((('LUNDI', 0.3), ('MARDI', 2.7), ('MERCREDI', 5.1))):
        page_calendrier(c, 70 + k * 640, 820, j, 255 * clamp((t - t0) * 3), -4 + k * 4)

# 10.2 — jeudi, l'école de Blagnac, Jeanne
B102 = [B(1.0, 1.8, 'Alors ? Ce peintre ?', 640, 200, (720, 380), largeur=360),
        B(2.8, None, 'Il danse. Il dessine des avions. Il peint des hiboux.', 1320, 190, (1200, 380), largeur=520),
        B(6.6, 1.6, 'Et toi ?', 640, 200, (720, 380), largeur=220),
        B(8.2, 2.8, 'Moi, je lis Freud en cachette.', 1320, 190, (1200, 380), largeur=440),
        B(11.0, 2.6, 'Tu devrais le lire à voix haute.', 640, 200, (720, 380), largeur=440),
        B(13.8, 3.2, 'Tu ferais une excellente médecin.', 640, 200, (720, 380), largeur=460)]
def p102(c, t, f):
    ecole_blagnac(c, W, H, t)
    # le banc
    poly(c, [(560, H * 0.84), (1300, H * 0.84), (1300, H * 0.87), (560, H * 0.87)], BRUN, 4)
    for xx in (600, 1260):
        ligne(c, xx, H * 0.87, xx, H * 0.96, 8, 255, BRUN)
    pj = pose(assis=True, regard=0.5, expr='sourire' if t < 13 else 'determine', md=(2.0, 1.4) if 12.6 < t < 16 else (1.2, 1.6), mg=(1.0, 1.7),
              parle=parle(t, 1.0, 2.0) + parle(t, 6.6, 7.2) + parle(t, 11.0, 12.4) + parle(t, 13.8, 15.4))
    figure(c, 720, H * 0.84 + 760 / 8.2 * 2.2, 760, 'jeanne', pj, 1, 255, False)
    pl = pose(assis=True, regard=-0.5, expr='rire' if 3 < t < 6 else ('gene' if t < 11 else ('surpris' if t < 15 else 'pensif')), md=(1.2, 1.6), mg=(1.0, 1.7),
              rougir=0.6 if 3 < t < 6 else 0, parle=parle(t, 2.8, 5.6) + parle(t, 8.2, 9.8))
    figure(c, 1120, H * 0.84 + 720 / 8.2 * 2.2, 720, 'louise_manteau', pl, -1, 255, False)
    # le manuel d'anatomie qui glisse sur le banc
    if t > 12.6:
        x = lerp(820, 960, ease(lin(t, 12.6, 13.6)))
        poly(c, [(x, H * 0.84), (x + 150, H * 0.84), (x + 150, H * 0.8), (x, H * 0.8)], '#a8201a', 3)
        texte(c, 'ANATOMIE', x + 75, H * 0.832, font('machine', 18), PAPIER, 255, 'center')
    if t > 16.4:
        onomatopee(c, 'DRIIING', 1500, 200, 80, -8, ENCRE, PAPIER, 255 * env(t, 16.4, 18.4, 0.2))
    dessiner_bulles(c, t, B102)
    page_calendrier(c, 60, 60, 'JEUDI', 255 * env(t, 0.1, 3.0, 0.3), -4)

# 10.3 — vendredi, le studio de Julien : la photographie
def p103(c, t, f):
    studio_photo(c, W, H, t)
    flash = env(t, 3.2, 4.0, 0.12)
    couple(c, 820, 1020, H * 0.97, 700, ('celestin', 'louise_jour'), 'main', pose(regard=0.2 if t < 3 else 0.0, expr='sourire'),
           pose(regard=-0.2 if t < 3 else 0.0, expr='rire' if t < 2.8 else 'sourire', rougir=0.4))
    appareil_trepied(c, 1560, H * 0.97, 1.1, 255, flash)
    figure(c, 1640, H * 1.03, 760, 'julien', pose(regard=-0.4, expr='rire', md=(0.9, -0.2) if t < 3.2 else 'leve', mg=(0.6, -0.4)), -1)
    if 1.0 < t < 3.2:
        bulle(c, 'Ne bougez plus…', 1420, 200, 400, (1600, 330), 255 * env(t, 1.0, 3.2, 0.2), clamp((t - 1.0) / 0.25), 36)
    if flash > 0:
        c.drawRect(skia.Rect.MakeWH(W, H), P(BLANC, 230 * flash))
        onomatopee(c, 'FLASH !', 1300, 300, 120, -8, ENCRE, PAPIER, 255 * flash)
    # l'image se fige en négatif, puis le tirage se développe
    if t > 4.0:
        k = ease(lin(t, 4.0, 4.6))
        def contenu(cc, w, h):
            cc.drawRect(skia.Rect.MakeWH(w, h), P('#c8b08a'))
            couple(cc, w * 0.4, w * 0.6, h * 0.98, h * 0.95, ('celestin', 'louise_jour'), 'main', pose(regard=0.0, expr='sourire'), pose(regard=0.0, expr='sourire'))
        tirage_julien(c, 720, 80 + (1 - k) * 200, 480, 255 * k, -3, ease(lin(t, 4.6, 7.4)), contenu)
    page_calendrier(c, 60, 60, 'VENDREDI', 255 * env(t, 0.1, 3.0, 0.3), -4)

# 10.4 — samedi, le grenier : le portrait dévoilé ; Chopin
B104 = [B(2.0, 1.8, 'C’est moi ?', 1340, 200, (1260, 360), largeur=280),
        B(3.8, 2.0, 'C’est ce que j’ai vu.', 560, 200, (620, 360), largeur=380),
        B(5.8, 2.0, 'Les yeux sont rouges.', 1340, 200, (1260, 360), largeur=360),
        B(7.8, 2.0, 'Ils étaient en colère.', 560, 200, (620, 360), largeur=360),
        B(9.8, 3.0, 'Ils sont surtout attentifs.', 1340, 200, (1260, 360), largeur=420)]
def p104(c, t, f):
    grenier(c, W, H, t, False, 0)
    tx, ty, tw, th = chevalet(c, 960, H * 0.95, 700, 'vide')
    devoile = ease(lin(t, 0.6, 1.6))
    portrait_louise(c, tx + 6, ty + 6, tw - 12, th - 12, 1.0)
    if devoile < 1:
        poly(c, [(tx + tw * devoile, ty), (tx + tw, ty), (tx + tw, ty + th), (tx + tw * devoile, ty + th)], '#fbf6ea', 4)
    figure(c, 540, H * 1.03, 800, 'celestin', pose(regard=0.6, expr='tendre', md=(1.8, 0.6) if t < 1.6 else 'ballant', mg='dos',
                                                    parle=parle(t, 3.8, 4.8) + parle(t, 7.8, 8.8)), 1)
    figure(c, 1380, H * 1.03, 740, 'louise_jour', pose(regard=-0.6, expr='surpris' if t < 5 else ('pensif' if t < 9.8 else 'sourire'), md='coeur', mg='ballant',
                                                         rougir=0.7 if t > 9.8 else 0, parle=parle(t, 2.0, 2.8) + parle(t, 5.8, 6.8) + parle(t, 9.8, 11.4)), -1)
    if t < 2.4:
        lignes_vitesse(c, 960, H * 0.45, 300, 1300, 70, ENCRE, 3, 5, 200 * env(t, 0.8, 2.4, 0.3))
    # Chopin, arrivé on ne sait comment, saute sur le chevalet
    if t > 12.4:
        tt = t - 12.4
        x = lerp(1800, 1000, ease(lin(tt, 0, 0.6)))
        y = H * 0.95 - math.sin(clamp(tt / 0.8) * math.pi) * 300
        y = min(y, H * 0.95) if tt < 0.8 else ty - 10
        chopin(c, x, y, 220, -1, 255, queue=t * 3, assis=tt > 0.8)
        onomatopee(c, 'HOP', 1300, 360, 70, -10, ENCRE, PAPIER, 255 * env(tt, 0.2, 1.2, 0.15))
        if tt > 0.9:
            c.save(); c.translate(960, H * 0.6); c.rotate(math.sin(tt * 18) * 3 * (1 - clamp(tt - 1.6))); c.restore()
            onomatopee(c, 'OUPS !', 600, 300, 80, 8, ROUGE, PAPIER, 255 * env(tt, 0.9, 2.6, 0.15))
    dessiner_bulles(c, t, B104)
    page_calendrier(c, 60, 60, 'SAMEDI', 255 * env(t, 0.1, 3.0, 0.3), -4)

# 10.5 — dimanche, la nuit : la lettre ; 10.6 — Louise la trouve sur l'oreiller
def p105(c, t, f):
    if t < 8.0:
        grenier(c, W, H, t, True, 0)
        lampe_bureau(c, 1180, H * 0.78, 1.2)
        poly(c, [(500, H * 0.78), (1500, H * 0.78), (1500, H * 0.82), (500, H * 0.82)], BRUN, 4)
        figure(c, 760, H * 1.0, 760, 'celestin', pose(assis=True, regard=0.6, oeil=(0.3, 0.8), expr='pensif' if t < 5 else 'tendre',
                                                    md='ecrit', mg=(1.4, 1.6), buste=14), 1, 255, False)
        papier(c, 980, H * 0.7, 300, 80, 255, 0, '#f7efdf')
        n = int(clamp(t / 6.0) * 10)
        for i in range(min(n, 3)):
            trait(c, [(20 + j * 13, 20 + i * 18 + math.sin(j + i) * 2) for j in range(20)], 2, BLEU)
        if 2.6 < t < 3.6:
            trait(c, [(20, 38), (280, 40)], 4, ENCRE)
        c.restore()
        if t > 6.4:
            lettre_pliee(c, 1100, H * 0.62, 160, 255, -6, 0.0)
        dessiner_recits(c, t, [R_(1.4, 5.6, 'Il y a des choses qu’on ne dit que par écrit.', 120, 80, 860, 40)])
        page_calendrier(c, W - 300, 60, 'DIMANCHE', 255 * env(t, 0.1, 3.0, 0.3), 4)
    else:
        tt = t - 8.0
        chambre_louise(c, W, H, t, 255, False, 0, False, False)
        lettre_pliee(c, 220, H * 0.6, 120, 255 * (1 - ease(lin(tt, 1.6, 2.0))), -12, 0)
        # Marthe passe devant la porte, sourit derrière sa main
        if tt < 3.4:
            figure(c, lerp(1900, 1450, ease(lin(tt, 0, 1.0))) if tt < 2 else lerp(1450, 2100, ease(lin(tt, 2.0, 3.4))), H * 0.97, 620, 'marthe',
                   pose(regard=-0.6, expr='sourire', md='bouche', mg='ballant'), -1)
        lit = ease(lin(tt, 1.6, 2.4))
        figure(c, 720, H * 1.02, 760, 'louise_jour', pose(regard=0.3, oeil=(0.2, 0.6), expr='pensif' if tt < 4.4 else 'surpris', md=(1.4, 0.9), mg=(1.0, 1.0),
                                                          main_d='lettre' if lit > 0.5 else None), 1)
        k = env(tt, 4.4, 8.4, 0.3)
        if k > 0:
            def yeux(c, w, h):
                c.drawRect(skia.Rect.MakeWH(w, h), P(PAPIER))
                tete(c, w / 2, h / 2 - 300 * 0.2, 300, 'louise', 'surpris' if tt < 6.4 else 'larmes', 0, 0, 255, (0, 0.5), 0, 0.8)
            case(c, (W - 920, 60, 860, 280), yeux, tt, k, 'droite')
        if tt > 7.6:
            bulle(c, '(Elle la replie, et la glisse dans le livre de Freud.)', 1400, 860, 640, None, 255 * env(tt, 7.6, 9.8, 0.2), clamp((tt - 7.6) / 0.25), 30, 'pensee')

PLANS = [
    Plan(8.2, p101, '10.1', entree=('noir', 0.5)),
    Plan(18.6, p102, '10.2', entree=('fondu', 0.4)),
    Plan(8.4, p103, '10.3', entree=('fondu', 0.4)),
    Plan(15.4, p104, '10.4', entree=('fondu', 0.4)),
    Plan(18.0, p105, '10.5-10.6', entree=('iris', 0.8), sortie=('iris', 1.0)),
    titre_chapitre('Chapitre dixième', 'La semaine volée'),
]
