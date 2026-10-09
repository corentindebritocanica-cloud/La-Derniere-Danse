"""Séquence 1 — Célestin (chapitre 1)."""
from scenes import *

# 1.1 — les toits de Toulouse au petit matin, travelling jusqu'à la fenêtre en demi-lune
def p11(c, t, f):
    D = 8.0
    k = ease(lin(t, 0, D))
    with camera(c, t, D, 1.0, 1.35, W * 0.7, H * 0.45, 0, -260, 0, 40):
        ciel_aube(c, W, H, 0.85, 0.72)
        nuages(c, W, H, t, 0.12, 4, 3, 200)
        toits_toulouse(c, W, H, H * 0.62, t, k * 200, False, 13, 255, 0.9)
        garonne(c, W, H * 0.62, H * 0.12, t, False, k * 200)
        # quai et façade de la boulangerie (la fenêtre en demi-lune sous le toit)
        bx = W * 0.62
        poly(c, [(bx, H), (bx, H * 0.38), (bx + 420, H * 0.38), (bx + 420, H)], BRIQUE, 4, 255, 0.25, 5)
        poly(c, [(bx - 20, H * 0.38), (bx + 210, H * 0.22), (bx + 440, H * 0.38)], '#9a5a40', 4)
        fen = skia.Path(); fen.moveTo(bx + 110, H * 0.48); fen.arcTo(skia.Rect.MakeXYWH(bx + 110, H * 0.38, 200, 200), 180, 180, False); fen.close()
        c.drawPath(fen, P('#f6e7c4')); c.drawPath(fen, P(ENCRE, stroke=6))
        for j in range(5):
            ang = math.pi + j * math.pi / 4
            ligne(c, bx + 210, H * 0.48, bx + 210 + math.cos(ang) * 100, H * 0.48 + math.sin(ang) * 100, 3, 255, BRUN)
        poly(c, [(bx + 30, H * 0.8), (bx + 390, H * 0.8), (bx + 390, H * 0.86), (bx + 30, H * 0.86)], '#5a3e1b', 3)
        texte(c, 'BOULANGERIE FABRE', bx + 210, H * 0.845, font('titre', 30), OR, 255, 'center')
        rue_pavee(c, W, H, H * 0.93, t, False, 0)
    sous_titre_lieu(c, t, 'Toulouse — rue de la République, un matin de décembre', 0.5, 6.5)

# 1.2 — le réveil : le pouce bleu de Prusse, le sourire de travers
def p12(c, t, f):
    fond_cases(c)
    # grande case : le grenier, Célestin se redresse
    def grande(c, w, h):
        grenier(c, w, h, t, False, 0)
        lit_de_fer(c, 120, h * 0.95, 560)
        k = ease(lin(t, 0.4, 1.8))
        etire = ease(lin(t, 1.6, 2.4)) * (1 - ease(lin(t, 3.2, 4.0)))
        md = (lerp(0.9, 0.8, etire), lerp(2.2, -2.4, etire)); mg = (lerp(-0.9, -0.8, etire), lerp(2.2, -2.4, etire))
        po = pose(buste=lerp(-55, -4, k), tete=lerp(-10, 0, k), regard=0.5, jd=88, gd=-88, jg=84, gg=-84,
                  md=md, mg=mg, expr='ferme' if t < 2.4 else 'neutre', clign=cligne(t, 1))
        figure(c, 300, h * 0.95 - 95 + 610 / 8.2 * 4.05, 610, 'celestin', po, 1, ombre=False)
        # la couverture sur les jambes
        poly(c, [(150, h * 0.95 - 95), (690, h * 0.95 - 92), (700, h * 0.95 - 40), (140, h * 0.95 - 40)], BLANC, 4, 255, 0.12, 6, smooth=False)
        if 1.7 < t < 3.2:
            onomatopee(c, 'Hmmm…', 520, 180, 64, -6, ENCRE, PAPIER, 255 * env(t, 1.7, 3.2, 0.3))
    case(c, (24, 24, 1180, 1032), grande, t, lin(t, 0, 0.4), 'gauche')
    # case : le pouce bleu
    def pouce(c, w, h):
        c.drawRect(skia.Rect.MakeWH(w, h), P(BLANC))
        lignes_vitesse(c, w / 2, h / 2, 120, 900, 60, ENCRE, 3, 6)
        # une main qui tient un pinceau ; l'ongle du pouce est bleu de Prusse
        trait(c, [(w * 0.1, h * 0.85), (w * 0.85, h * 0.15)], 26, BRUN)
        encre(c, path_pts([(w * 0.83, h * 0.17), (w * 0.95, h * 0.04), (w * 0.9, h * 0.2)]), BLEU, 4)
        poing = path_pts([(w * 0.28, h * 0.95), (w * 0.22, h * 0.62), (w * 0.34, h * 0.46), (w * 0.58, h * 0.42), (w * 0.7, h * 0.55), (w * 0.66, h * 0.8), (w * 0.5, h * 0.98)], smooth=True)
        encre(c, poing, PEAU, 7)
        for k in range(3):
            trait(c, [(w * (0.36 + k * 0.09), h * 0.5), (w * (0.36 + k * 0.09), h * 0.7)], 4)
        pouce_ = capsule((w * 0.36, h * 0.52), (w * 0.62, h * 0.3), 34, 30)
        encre(c, pouce_, PEAU, 7)
        c.drawPath(ovale(w * 0.6, h * 0.31, 22, 16), P(BLEU)); c.drawPath(ovale(w * 0.6, h * 0.31, 22, 16), P(ENCRE, stroke=4))
        texte(c, 'bleu de Prusse', w / 2, h - 40, font('main', 46), BLEU, 255, 'center')
    case(c, (1228, 24, 668, 500), pouce, t, lin(t, 2.6, 3.1), 'droite')
    # case : le sourire de travers
    def sourire(c, w, h):
        gros_plan(c, t, 'celestin', 'sourire' if t > 5.6 else 'neutre', 0.35, w / 2, h / 2 + 30, 170, 'shojo', 2)
    case(c, (1228, 548, 668, 508), sourire, t, lin(t, 4.6, 5.1), 'bas')
    if t > 5.8:
        notes_qui_montent(c, t, 1700, 760, 3, 44, 255 * clamp(t - 5.8), ENCRE, 0.45, 220)

# 1.3 — la valse avec une partenaire invisible ; souvenir de la cuisine
def p13(c, t, f):
    with camera(c, t, 14, 1.05, 1.0, W / 2, H * 0.6):
        grenier(c, W, H, t, False, 0, fenetre=True)
        tx, ty, tw, th = chevalet(c, 1500, H * 0.86, 560, 'vide')
        # toile à moitié peinte : un ciel de nuit
        c.save(); c.clipRect(skia.Rect.MakeXYWH(tx + 6, ty + 6, tw - 12, th * 0.55))
        c.translate(tx, ty); ciel_nuit(c, tw, th, t, 30, 2, lune=False, horizon=1)
        c.restore()
        # valse : trois temps, il tourne avec une partenaire qu'on ne voit pas
        ph = t * 1.4
        tour = math.cos(ph * 0.5)
        sens = math.copysign(max(0.25, abs(tour)), tour)
        x = 640 + math.sin(ph * 0.5) * 160
        pas = math.sin(ph * math.pi)
        po = pose(buste=-4, regard=0.7, expr='tendre', mg='valse', md='valse', jd=10 + pas * 14, gd=-6, jg=-10 - pas * 14, gg=6,
                  saut=abs(pas) * 0.15, devant='d')
        figure(c, x, H * 0.9, 760, 'celestin', po, sens)
        # la partenaire invisible : des scintillements
        for k in range(7):
            ang = ph + k * 0.9
            scintille(c, x + sens * 210 + math.cos(ang) * 40, H * 0.46 + math.sin(ang * 1.3) * 120, 10 + 6 * math.sin(ang * 2), 220)
        if t > 1.0:
            for k_, s in enumerate(('1', '2', '3')):
                al = 255 * env((t * 1.4 + k_ / 3) % 1, 0, 1, 0.2)
                onomatopee(c, s, 300 + k_ * 110, 230 - k_ * 10, 70, -8, ENCRE, PAPIER, al)
    # case souvenir (sépia) : une cuisine, une femme, un garçon de douze ans
    k = ease(lin(t, 4.0, 4.8)) * (1 - ease(lin(t, 13.2, 13.9)))
    if k > 0:
        def souvenir(c, w, h):
            c.drawRect(skia.Rect.MakeWH(w, h), P('#d9c29a'))
            c.drawRect(skia.Rect.MakeWH(w, h), trame(0.25, 6, 45, BRUN, 255))
            poly(c, [(0, h * 0.75), (w, h * 0.75), (w, h), (0, h)], '#b89a6a', 0)
            # fenêtre et fourneau en ombres
            c.drawRect(skia.Rect.MakeXYWH(w * 0.08, h * 0.15, w * 0.2, h * 0.32), P('#f0e0b8'))
            c.drawRect(skia.Rect.MakeXYWH(w * 0.7, h * 0.45, w * 0.25, h * 0.3), P(BRUN))
            pp = t * 1.4
            for (nom, xx, ss, hh) in (('figurante', w * 0.42, 1, h * 0.72), ('enfant', w * 0.58, -1, h * 0.5)):
                po = pose(mg='valse', md='valse', buste=math.sin(pp) * 4, jd=math.sin(pp * math.pi) * 10, jg=-math.sin(pp * math.pi) * 10)
                c.save()
                figure(c, xx, h * 0.92, hh, nom, po, ss, 255, False)
                c.restore()
            # tout en ombre sépia
            c.drawRect(skia.Rect.MakeWH(w, h), P('#5a3e1b', 150))
            texte(c, 'Castres, autrefois', w - 20, h - 24, font('main', 36), PAPIER, 255, 'right')
        case(c, (W - 760, 60, 700, 420), souvenir, t, k, 'droite', fond='#d9c29a')
    dessiner_recits(c, t, [R_(4.6, 4.2, 'Sa mère lui avait appris la valse dans une cuisine.', 90, 820, 860, 38),
                          R_(8.9, 4.6, 'Elle n’avait pas eu le temps de lui apprendre le reste.', 90, 820, 860, 38)])

# 1.4 — la boulangerie de madame Fabre
B14 = [B(1.2, None, 'Mon petit peintre, tu as encore la main bleue.', 1350, 200, (1400, 380), largeur=560),
       B(5.2, None, 'C’est la seule qui ne ment jamais, madame Fabre.', 560, 200, (620, 360), largeur=560)]
def p14(c, t, f):
    with camera(c, t, 11, 1.0, 1.08, W / 2, H * 0.6):
        boulangerie(c, W, H, t)
        # madame Fabre derrière le comptoir
        rf = B14[0]
        po = pose(regard=-0.6, expr='sourire', parle=parle(t, rf['t0'], rf['t0'] + 2.5), main_d='plateau', md=(1.3, 1.0),
                  mg=(lerp(-0.9, 1.9, ease(lin(t, 8.0, 9.0))), lerp(2.5, 1.2, ease(lin(t, 8.0, 9.0)))))
        figure(c, 1320, H * 0.98, 640, 'fabre', po, -1, ombre=False)
        # Célestin entre par la gauche (au premier plan, devant le comptoir)
        k = ease(lin(t, 0.0, 1.4))
        x = lerp(-200, 640, k)
        pas = math.sin(t * 9) * (1 - k)
        rc = B14[1]
        lv = ease(lin(t, 4.6, 5.4)) * (1 - ease(lin(t, 9.0, 9.6)))
        po2 = pose(regard=0.5, expr='sourire' if t > 7 else 'neutre', parle=parle(t, rc['t0'], rc['t0'] + 3),
                   jd=pas * 20, jg=-pas * 20, md=(lerp(1.0, 0.6, lv), lerp(2.7, -0.3, lv)) if t < 9.6 else (2.0, 1.1), mg='ballant')
        figure(c, x, H * 1.12, 820, 'celestin', po2, 1)
        if 9.0 < t:
            # le papier de croissants change de mains
            px = lerp(1120, 860, ease(lin(t, 9.0, 10.0)))
            papier_froisse(c, px - 60, 560, 120, 90)
            croissant(c, px - 20, 580, 26); croissant(c, px + 20, 590, 24)
        if 0.4 < t < 2.0:
            onomatopee(c, 'DRELIN !', 220, 160, 80, -10, ENCRE, PAPIER, 255 * env(t, 0.4, 2.0, 0.2))
    dessiner_bulles(c, t, B14)

# 1.5 — le Petit Citron refuse, puis démarre
def p15(c, t, f):
    with camera(c, t, 10, 1.0, 1.0, W / 2, H / 2, 0, 0):
        ciel_jour(c, W, H, 0.7)
        facade(c, -60, H * 0.78, 700, 600, False, 255, True, porte=True, graine=8)
        facade(c, 640, H * 0.78, 760, 560, False, 255, True, porte=False, graine=9)
        facade(c, 1400, H * 0.78, 700, 640, False, 255, True, porte=True, graine=10)
        rue_pavee(c, W, H, H * 0.78, t, False, 0)
        depart = 6.6
        k = ease_in(lin(t, depart, depart + 2.2))
        mx = 900 + k * 1800
        mini(c, mx, H * 0.97, 760, 1, roues=t * (0.1 + k * 3), secousse=1.0 if t > depart - 0.5 else 0.3 * (t % 2 < 1), f=f)
        if t > depart:
            for j in range(6):
                ph = (t * 2 + j / 6) % 1
                c.drawCircle(mx - 420 - ph * 260, H * 0.9 - ph * 60, 20 + ph * 50, P(BLANC, 220 * (1 - ph)))
                c.drawCircle(mx - 420 - ph * 260, H * 0.9 - ph * 60, 20 + ph * 50, P(ENCRE, 200 * (1 - ph), stroke=3))
            lignes_paralleles(c, (0, H * 0.45, W, H * 0.5), 0, 30, 3, ENCRE, 160 * clamp(t - depart), t)
        # Célestin à la manivelle (avant), puis au volant
        if t < depart:
            tourne = t * 2.4
            manx = 1268; many = H * 0.97 - 76 * 2.0
            r_ = 34
            cx_ = manx + math.cos(tourne * 2 * math.pi) * r_; cy_ = many + math.sin(tourne * 2 * math.pi) * r_
            trait(c, [(manx - 10, many), (cx_, cy_)], 8, ENCRE)
            po = pose(buste=34, regard=0.6, expr='determine' if t < 5 else 'gene', cible_d=(cx_, cy_), cible_g=(cx_ + 20, cy_ + 10),
                      jd=-25, gd=35, jg=18, gg=-8)
            figure(c, 1450, H * 0.98, 720, 'celestin', po, -1)
            for (t0, s, x, y) in ((0.6, 'TEUF…', 1500, 300), (1.8, 'TEUF…', 1620, 220), (3.0, '…pfff.', 1480, 260)):
                onomatopee(c, s, x, y, 76, -8, ENCRE, PAPIER, 255 * env(t, t0, t0 + 1.3, 0.2))
            onomatopee(c, 'VROUM !', 1300, 240, 120, -10, ROUGE, PAPIER, 255 * env(t, 4.8, 6.8, 0.2), back_out(lin(t, 4.8, 5.2)))
        else:
            onomatopee(c, 'POUÊT !', min(W - 200, mx - 100), 300, 110, 8, ENCRE, PAPIER, 255 * env(t, depart + 0.2, depart + 1.8, 0.2), back_out(lin(t, depart + 0.2, depart + 0.6)))

# 1.6 — les ateliers Latécoère, monsieur Baylac
B16 = [B(6.6, None, 'Delacroix, on dessine des avions, pas des rêves.', 1380, 160, (1430, 330), largeur=560),
       B(10.6, None, 'Un avion, monsieur, c’est un rêve avec des rivets.', 560, 180, (600, 380), largeur=560)]
def p16(c, t, f):
    hangar_latecoere(c, W, H, t, 255, 0)
    sous_titre_lieu(c, t, 'Ateliers Latécoère — Montaudran', 0.3, 4.5)
    # Célestin à sa planche
    # tabouret
    trait(c, [(470, H * 0.98), (500, H * 0.8)], 8, BRUN); trait(c, [(600, H * 0.98), (570, H * 0.8)], 8, BRUN)
    poly(c, [(450, H * 0.8 - 10), (620, H * 0.8 - 10), (620, H * 0.8 + 8), (450, H * 0.8 + 8)], BRUN, 4)
    po = pose(assis=True, saut=-1.98, buste=16, regard=0.7, oeil=(0.4, 0.5), expr='pensif' if t < 5 else ('tendre' if t < 6.5 else 'neutre'),
              md=(1.9 + math.sin(t * 3) * 0.15, 1.4), mg=(1.4, 1.7), parle=parle(t, B16[1]['t0'], B16[1]['t0'] + 3))
    figure(c, 540, H * 0.99, 760, 'celestin', po, 1, ombre=False)
    table_a_dessin(c, 640, H * 0.98, 700, 255, 'aile', t, ease(lin(t, 2.5, 5.0)))
    laissez_passer(c, 760, 860, 300, 255, -8, ease(lin(t, 0.8, 1.4)))
    # Baylac arrive par la droite, règle en main
    k = ease(lin(t, 5.0, 6.4)) * (1 - ease(lin(t, 14.4, 16)))
    x = lerp(2200, 1460, k)
    tap = abs(math.sin(t * 6)) if 6.4 < t < 9.6 else 0
    po2 = pose(regard=-0.5, expr='colere' if t < 12 else 'gene', main_d='regle', md=(0.9, 1.3 - tap * 0.3),
               mg=(0.7, 1.4) if t < 12.6 else (0.3, 1.0), parle=parle(t, B16[0]['t0'], B16[0]['t0'] + 3))
    figure(c, x, H * 1.02, 800, 'baylac', po2, -1)
    if tap > 0.9:
        onomatopee(c, 'TAP', x - 160, 520, 50, -10, ENCRE, PAPIER, 230)
    onomatopee(c, 'Hmpf.', 1500, 230, 90, -6, ENCRE, PAPIER, 255 * env(t, 13.0, 14.6, 0.2))
    dessiner_bulles(c, t, B16)
    # insert : la courbe d'aile qui devient une hanche de danseuse
    kk = ease(lin(t, 2.2, 2.7)) * (1 - ease(lin(t, 5.6, 6.0)))
    if kk > 0:
        def insert(c, w, h):
            c.drawRect(skia.Rect.MakeWH(w, h), P('#f6f2e6'))
            pts = courbe([(40, h * 0.7), (120, h * 0.42), (w * 0.45, h * 0.34), (w * 0.62, h * 0.5)], 10)
            trait(c, pts, 5, BLEU)
            pts2 = courbe([(w * 0.7, h * 0.15), (w * 0.8, h * 0.4), (w * 0.74, h * 0.62), (w * 0.84, h * 0.92)], 10)
            n = max(2, int(len(pts2) * ease(lin(t, 2.6, 4.8))))
            trait(c, pts2[:n], 5, BLEU)
            # la plume (main de Célestin)
            px, py = pts2[n - 1]
            trait(c, [(px, py), (px + 90, py - 140)], 10, ENCRE)
            c.drawCircle(px + 95, py - 150, 40, P(PEAU)); c.drawCircle(px + 95, py - 150, 40, P(ENCRE, stroke=4))
            c.drawCircle(px + 70, py - 165, 13, P(BLEU))
        case(c, (W - 700, 520, 640, 420), insert, t, kk, 'droite')

# 1.7 — le soir : le frac, le miroir fêlé
def p17(c, t, f):
    grenier(c, W, H, t, True, 0, fenetre=True)
    # miroir fêlé
    mx, my, mw, mh = 1050, 160, 520, 720
    poly(c, [(mx, my), (mx + mw, my), (mx + mw, my + mh), (mx, my + mh)], '#c8d4dc', 10, 255, 0.15)
    trait(c, [(mx + 80, my + 60), (mx + 200, my + 260), (mx + 160, my + 420), (mx + 300, my + 700)], 3, BLANC)
    trait(c, [(mx + 200, my + 260), (mx + 380, my + 320)], 2.5, BLANC)
    # Célestin dans le miroir (reflet), puis de dos au premier plan
    nk = clamp((t - 2) / 3)
    po = pose(regard=0.0, expr='sourire' if t > 5.5 else 'determine', md='noeud' if t < 5.2 else 'ballant', mg='noeud' if t < 5.2 else 'ballant', buste=0)
    c.save(); c.clipRect(skia.Rect.MakeXYWH(mx, my, mw, mh))
    figure(c, mx + mw / 2, my + mh + 380, 1000, 'celestin_frac', po, 1, 255, False)
    c.drawRect(skia.Rect.MakeXYWH(mx, my, mw, mh), P('#c8d4dc', 60))
    c.restore()
    # main qui noue le nœud papillon : petits traits de mouvement
    if t < 5:
        for k in range(3):
            onomatopee(c, 'zip', mx + mw / 2 + 120 + k * 30, my + 300 - k * 20, 34, -10, ENCRE, PAPIER, 255 * env((t * 2 + k / 3) % 1, 0, 1, 0.2))
    figure(c, 470, H * 1.25, 1150, 'celestin_frac', pose(regard=0.9, expr='neutre' if t < 5.5 else 'sourire', md='noeud' if t < 5.2 else 'ballant', mg='noeud' if t < 5.2 else 'ballant'), 1, 255, False)
    dessiner_recits(c, t, [R_(1.0, 3.6, 'Le jour, il dessinait des ailes.', 1180, 900, 640, 40),
                          R_(4.8, 4.4, 'La nuit, on l’appelait le peintre.', 1180, 900, 640, 40)])
    bandes_cinema(c, lin(t, 0, 1))

PLANS = [
    Plan(8.0, p11, '1.1', entree=('noir', 0.8)),
    Plan(8.0, p12, '1.2', entree=('fondu', 0.3)),
    Plan(14.0, p13, '1.3', entree=('fondu', 0.4)),
    Plan(11.5, p14, '1.4', entree=('fondu', 0.4)),
    Plan(10.0, p15, '1.5', entree=('blanc', 0.3)),
    Plan(16.5, p16, '1.6', entree=('fondu', 0.4)),
    Plan(10.5, p17, '1.7', entree=('iris', 1.2), sortie=('iris', 1.0)),
    titre_chapitre('Chapitre premier', 'Célestin'),
]
