"""Séquence 3 — le concours (chapitre 3)."""
from scenes import *

# 3.1 — la rue des Teinturiers, l'enseigne s'allume étoile par étoile, Maurice accueille
B31 = [B(4.6, None, 'Entrez, entrez, mes étoiles ! Ce soir, personne ne danse avec qui il pense !', 1380, 200, (1420, 420), largeur=620)]
def p31(c, t, f):
    allumees = int(clamp((t - 0.4) / 2.6) * 8.99)
    with camera(c, t, 11, 1.0, 1.06, W / 2, H * 0.5):
        ciel_nuit(c, W, H, t, 150, 4, lune=True, horizon=0.55)
        facade_cabaret(c, W, H, t, 255, 0, allumees, 0.0)
        affiche_concours(c, 1140, 520, 150, 255, 3)
        # la file d'attente
        public_ombres(c, W * 0.6, H * 1.0, t, 255, 7, 4, 280, 0)
        pm = pose(regard=-0.6, expr='rire' if t < 4.4 else 'sourire', md='ouvert', mg='ouvert', parle=parle(t, B31[0]['t0'], B31[0]['t0'] + 4))
        figure(c, 1460, H * 1.02, 780, 'maurice', pm, -1)
    if 0.4 < t < 3.4:
        onomatopee(c, 'TAC', 820 + allumees * 30, 300, 50, -10, OR, ENCRE, 255 * env(t, 0.4, 3.4, 0.2))
    onomatopee(c, 'BRRRAM', 300, 220, 80, -8, ENCRE, PAPIER, 255 * env(t, 3.3, 4.6, 0.15))
    dessiner_bulles(c, t, B31)
    sous_titre_lieu(c, t, 'Samedi 14 décembre — rue des Teinturiers', 0.2, 4.2)

# 3.2 — l'intérieur en travelling : la piste, la scène, l'orchestre qui s'accorde, Léon
def p32(c, t, f):
    D = 7.5
    pan = lerp(-300, 300, ease(lin(t, 0, D)))
    with camera(c, t, D, 1.15, 1.0, W / 2, H * 0.45):
        salle_cabaret(c, W, H, t, 255, pan, 1.0, True, True, True, None, f)
        public_ombres(c, W, H * 1.02, t, 255, 12, 7, 320, pan * 1.6)
    if t > 1:
        notes_qui_montent(c, t, W * 0.55, H * 0.32, 4, 46, 255, OR, 0.4, 260, contour=ENCRE)
    for (t0, s, x, y) in ((0.6, 'tsoin', 380, 220), (1.8, 'bom bom', 1500, 260), (3.4, 'tûûût', 900, 150)):
        onomatopee(c, s, x, y, 58, -8, OR, ENCRE, 255 * env(t, t0, t0 + 1.6, 0.2))
    # gros plan sur Léon qui lève le menton
    k = env(t, 4.4, D, 0.4)
    if k > 0:
        def leon(c, w, h):
            gros_plan(c, t, 'leon', 'sourire', 0.4, w / 2, h / 2 + 30, 150, 'soleil', 4, incl=-6, couleur_fond='#3a2a2a')
        case(c, (W - 640, 60, 580, 420), leon, t, k, 'droite', fond=ENCRE)

# 3.3 — la boîte du tirage au sort
B33 = [B(1.0, None, 'Un confirmé tire un débutant, un débutant tire un confirmé.', 1250, 170, (1180, 330), largeur=640),
       B(5.4, None, 'Le hasard est un excellent chorégraphe !', 1250, 170, (1180, 330), largeur=560, style='cri')]
def p33(c, t, f):
    salle_cabaret(c, W, H, t, 255, 0, 0.8, True, True, True, None, f)
    # Maurice sur la scène avec la boîte laquée
    pm = pose(regard=0.2, expr='rire' if t > 5.4 else 'sourire', md=(1.3, 0.6), mg=(-1.2, 0.4) if t < 5.4 else 'leve',
              parle=parle(t, B33[0]['t0'], B33[0]['t0'] + 3.5) + parle(t, B33[1]['t0'], B33[1]['t0'] + 2.5))
    inf = figure(c, 960, H * 0.47, 520, 'maurice', pm, 1)
    bx, by = inf['main_d']
    poly(c, [(bx - 70, by - 10), (bx + 70, by - 10), (bx + 60, by + 80), (bx - 60, by + 80)], ROUGE, 4, 255, 0.2, 5)
    etoile(c, bx, by + 35, 22, 8, 0.42, OR)
    texte(c, 'CONFIRMÉS · DÉBUTANTS', bx, by - 20, font('machine', 18), OR, 255, 'center')
    public_ombres(c, W, H * 1.04, t, 255, 11, 9, 260, 0)
    # Julien photographie le moment
    flash = env(t, 7.4, 8.2, 0.15)
    appareil_trepied(c, 260, H * 1.05, 0.9, 255, flash)
    if flash > 0:
        c.drawRect(skia.Rect.MakeWH(W, H), P(BLANC, 170 * flash))
        onomatopee(c, 'CLIC !', 330, 380, 90, -8, ENCRE, PAPIER, 255 * flash)
    dessiner_bulles(c, t, B33)

# 3.4 — le papier de Célestin, le papier de Louise
def p34(c, t, f):
    fond_cases(c)
    def main_c(c, w, h):
        c.drawRect(skia.Rect.MakeWH(w, h), P('#2a2022'))
        lignes_vitesse(c, w / 2, h / 2, 120, 900, 70, OR, 2, 5, 120)
        k = ease(lin(t, 0.3, 1.4))
        y = lerp(h + 100, h * 0.55, k)
        papier_froisse(c, w / 2 - 170, y - 110, 340, 200, 255, '#fbf6ea')
        texte(c, 'Débutante', w / 2, y + 10, font('main', 64), ENCRE, 255 * clamp(t - 1.0), 'center')
        etoile(c, w / 2 + 130, y - 60, 14, 8, 0.42, ENCRE, 255 * clamp(t - 1.0))
        encre(c, union(ovale(w / 2 - 210, y + 60, 70, 60), capsule((w / 2 - 170, y + 20), (w / 2 - 120, y - 40), 26, 22)), PEAU, 5)
        c.drawCircle(w / 2 - 120, y - 45, 14, P(BLEU))
        texte(c, 'Célestin', 30, 60, font('machine', 34), PAPIER, 255)
    case(c, (24, 24, 924, 1032), main_c, t, lin(t, 0, 0.4), 'gauche')
    def main_l(c, w, h):
        c.drawRect(skia.Rect.MakeWH(w, h), P('#2a2022'))
        lignes_vitesse(c, w / 2, h / 2, 120, 900, 70, OR, 5, 5, 120)
        sursaut = back_out(lin(t, 3.2, 3.6))
        y = h * 0.55 - sursaut * 30
        papier_froisse(c, w / 2 - 170, y - 110, 340, 200, 255, '#fbf6ea')
        texte(c, 'M. Delacroix', w / 2, y + 10, font('main', 58), ENCRE, 255, 'center')
        c.drawCircle(w / 2 + 110, y + 60, 26, P(BLEU, 200))
        for k in range(4):
            c.drawCircle(w / 2 + 110, y + 60, 8 + k * 5, P(mix(BLEU, PAPIER, 0.4), 160, stroke=1.5))
        texte(c, 'Louise', 30, 60, font('machine', 34), PAPIER, 255)
        if t > 3.2:
            onomatopee(c, '!!', w * 0.75, h * 0.2, 120, 10, ROUGE, PAPIER, 255 * env(t, 3.2, 7.6, 0.2), back_out(lin(t, 3.2, 3.5)))
    case(c, (972, 24, 924, 1032), main_l, t, lin(t, 2.4, 2.8), 'droite')

# 3.5 — à travers la salle : les lunettes rondes, les yeux de hibou
B35 = [B(3.4, 2.9, 'C’est lui, mon confirmé ?', 1500, 760, (1700, 600), style='murmure', largeur=480, taille=34),
       B(6.0, 2.4, 'C’est le peintre.', 380, 760, (210, 600), largeur=420, taille=34),
       B(8.2, 2.8, 'Il a du bleu sur le pouce.', 1500, 760, (1700, 600), style='murmure', largeur=460, taille=34),
       B(10.8, 3.2, 'Il a toujours du bleu sur le pouce.', 380, 760, (210, 600), largeur=460, taille=34)]
def p35(c, t, f):
    fond_cases(c)
    def yeux_c(c, w, h):
        c.drawRect(skia.Rect.MakeWH(w, h), P(PAPIER))
        tete(c, w / 2, h / 2 - 520 * 0.22, 520, 'celestin', 'neutre' if t < 6 else 'tendre', 0.0, 0, 255, (0.2, 0), cligne(t, 1))
    def yeux_l(c, w, h):
        c.drawRect(skia.Rect.MakeWH(w, h), P(PAPIER))
        tete(c, w / 2, h / 2 - 520 * 0.24, 520, 'louise', 'surpris' if t < 3 else ('neutre' if t < 8 else 'pensif'), 0.0, 0, 255, (-0.2, 0), cligne(t, 3))
    case(c, (24, 24, W - 48, 240), yeux_c, t, lin(t, 0, 0.4), 'gauche')
    case(c, (24, 288, W - 48, 240), yeux_l, t, lin(t, 0.8, 1.2), 'droite')
    # Solange et Louise, côte à côte, chuchotent
    def bas(c, w, h):
        salle_cabaret(c, w, h * 1.6, t, 255, 0, 0.8, True, False, False, None, f)
        pl = pose(regard=-0.7, expr='surpris' if t < 5 else 'pensif', md='coeur', mg='ballant', rougir=0.5 if t > 8 else 0,
                  parle=parle(t, B35[0]['t0'], B35[0]['t0'] + 1.5) + parle(t, B35[2]['t0'], B35[2]['t0'] + 1.5))
        figure(c, w * 0.78, h * 1.9, 860, 'louise', pl, -1, 255, False)
        ps = pose(regard=0.6, expr='sourire', md='hanches', mg='hanches',
                  parle=parle(t, B35[1]['t0'], B35[1]['t0'] + 1.2) + parle(t, B35[3]['t0'], B35[3]['t0'] + 1.8))
        figure(c, w * 0.12, h * 1.9, 900, 'solange', ps, 1, 255, False)
    case(c, (24, 552, W - 48, 504), bas, t, lin(t, 2.0, 2.4), 'bas')
    if 1.4 < t < 3.2:
        notes_qui_montent(c, t, W / 2, 560, 2, 50, 255 * env(t, 1.4, 3.2, 0.3), OR, 0.6, 140, contour=ENCRE)
    dessiner_bulles(c, t, B35)

# 3.6 — au bord de la piste
B36 = [B(0.8, 2.0, 'Célestin.', 640, 200, (720, 340), largeur=300),
       B(2.8, None, 'Louise. Je ne sais pas danser.', 1260, 200, (1180, 360), largeur=480),
       B(5.6, None, 'Moi non plus, pas avec vous.', 640, 200, (720, 340), largeur=460)]
def p36(c, t, f):
    with camera(c, t, 10, 1.0, 1.12, W / 2, H * 0.4):
        salle_cabaret(c, W, H, t, 255, 0, 0.8, True, True, True, H * 0.86, f)
        pc = pose(regard=0.7, expr='neutre' if t < 6 else 'sourire', md=(1.2, 1.6) if t < 1.6 else 'ballant', mg='dos',
                  parle=parle(t, B36[0]['t0'], B36[0]['t0'] + 0.8) + parle(t, B36[2]['t0'], B36[2]['t0'] + 2))
        figure(c, 760, H * 1.02, 820, 'celestin', pc, 1)
        pl = pose(regard=-0.7, expr='determine' if t < 5.5 else ('colere' if t < 8 else 'gene'), md='coeur', mg='ballant',
                  rougir=0.6 if t > 8 else 0, parle=parle(t, B36[1]['t0'], B36[1]['t0'] + 2))
        figure(c, 1150, H * 1.02, 760, 'louise', pl, -1)
    if t > 7.8:
        onomatopee(c, 'grrr', 1300, 240, 60, 6, ENCRE, PAPIER, 255 * env(t, 7.8, 9.5, 0.2))
    dessiner_bulles(c, t, B36)

# 3.7 — trois danses : valse raide, fox-trot qui fait rire, puis « Libre ! Inventez ! »
def p37(c, t, f):
    salle_cabaret(c, W, H, t, 255, 0, 1.0, False, True, True, H * 0.72, f)
    # autres couples en ombres au fond
    for k in range(3):
        xk = 300 + k * 650 + math.sin(t + k) * 40
        en_silhouette(c, lambda cc, xk=xk, k=k: couple(cc, xk, xk + 130, H * 0.66, 320, ('figurant_h', 'figurante'), 'ferme',
                                                      pose(**pas_de_valse(t + k)), pose(**pas_de_valse(t + k + 0.5), jupe=0.3)), '#3a2a2a')
    if t < 5.5:  # la valse : elle compte
        pv = pas_de_valse(t, 0.9, 0.8)
        couple(c, 830, 1080, H * 1.0, 760, prise='ferme', pc=pose(regard=0.7, expr='tendre', **pv),
               pl=pose(regard=-0.6, expr='determine', **pv, jupe=0.15))
        for k, s in enumerate(('un…', 'deux…', 'trois…')):
            tt = 0.8 + k * 1.2
            bulle(c, s, 1380 + k * 70, 220 + k * 60, 260, (1150, 360), 255 * env(t, tt, tt + 1.4, 0.2), clamp((t - tt) / 0.2), 34, 'murmure')
        texte(c, 'Première danse : la valse', 60, H - 50, font('machine', 34), PAPIER, 255 * env(t, 0.2, 5.4, 0.3))
    elif t < 11.0:  # fox-trot : elle lui marche sur le pied
        tt = t - 5.5
        sw = math.sin(tt * 5)
        couple(c, 820 + sw * 30, 1070 + sw * 30, H * 1.0, 760, prise='main',
               pc=pose(regard=0.7, expr='rire' if tt > 3 else 'sourire', jd=sw * 18, jg=-sw * 18, buste=sw * 3),
               pl=pose(regard=-0.6, expr='rire' if tt > 3 else 'gene', jd=-sw * 18, jg=sw * 18, jupe=0.3 + 0.2 * abs(sw)))
        if 1.6 < tt < 3.4:
            onomatopee(c, 'AÏE !', 760, 300, 110, -10, ROUGE, PAPIER, 255 * env(tt, 1.6, 3.4, 0.15), back_out(lin(tt, 1.6, 1.9)))
            etoile(c, 860, H * 0.95, 30, 5, 0.45, OR, 255 * env(tt, 1.6, 3.4, 0.15))
        if tt > 3.4:
            onomatopee(c, 'ha ha ha', 1350, 260, 70, 8, ENCRE, PAPIER, 255 * env(tt, 3.4, 5.4, 0.2))
        texte(c, 'Deuxième danse : le fox-trot', 60, H - 50, font('machine', 34), PAPIER, 255 * env(tt, 0.2, 5.4, 0.3))
    else:  # troisième danse : libre
        tt = t - 11.0
        pm = pose(regard=0.1, expr='rire', md='leve', mg='ouvert', parle=parle(tt, 0.3, 2.0))
        figure(c, 960, H * 0.47, 480, 'maurice', pm, 1)
        bulle(c, 'Libre ! Inventez !', 1300, 160, 460, (1060, 250), 255 * env(tt, 0.3, 3.6, 0.2), clamp((tt - 0.3) / 0.25), 46, 'cri')
        if tt > 2.0:
            notes_qui_montent(c, tt, W * 0.62, H * 0.3, 4, 52, 255, OR, 0.5, 300, contour=ENCRE)
        couple(c, 840, 1060, H * 1.0, 760, prise='main', pc=pose(regard=0.7, expr='determine'), pl=pose(regard=-0.6, expr='surpris'))
        texte(c, 'Troisième danse : au choix du hasard', 60, H - 50, font('machine', 34), PAPIER, 255 * env(tt, 0.2, 4.8, 0.3))

# 3.8 — la danse qui n'existe pas encore (cerf-volant, plongée, ombres chinoises)
def p38(c, t, f):
    D = 13.0
    if t < 4.5:
        # plongée sur la piste : les autres couples s'écartent
        salle_cabaret(c, W, H, t, 255, 0, 1.0, True, False, False, H * 0.62, f)
        ecart = ease(lin(t, 0.5, 3.0))
        for k in range(6):
            ang = k / 6 * 2 * math.pi + 0.3
            rr = lerp(260, 640, ecart)
            xk = W / 2 + math.cos(ang) * rr; yk = H * 0.62 + math.sin(ang) * rr * 0.4
            en_silhouette(c, lambda cc, xk=xk, yk=yk: couple(cc, xk - 60, xk + 60, yk + 160, 260, ('figurant_h', 'figurante'), 'main'), '#3a2a2a')
        ang = t * 1.2
        rr = 170
        xl = W / 2 + math.cos(ang) * rr
        couple(c, W / 2 - 60, xl + 60, H * 0.62 + 300, 520, prise='cerf', pc=pose(regard=0.7, expr='determine'),
               pl=pose(regard=-0.7, expr='surpris', jupe=0.7, buste=-12), tour_l=math.cos(ang))
        lignes_paralleles(c, (0, 0, W, H), 20, 20, 2, OR, 90, t)
    else:
        tt = t - 4.5
        # ombres chinoises sur un soleil d'or : il l'envoie au bout de son bras « comme un cerf-volant »
        c.drawRect(skia.Rect.MakeWH(W, H), P(mix(OR, PAPIER, 0.3)))
        soleil_deco(c, W / 2, H * 0.62, 160, 1600, 36, tt * 0.12, OR, 255, mix(OR, ROUGE, 0.25))
        c.drawCircle(W / 2, H * 0.62, 300, degrade_rad(W / 2, H * 0.62, 300, [hexc(BLANC, 200), hexc(BLANC, 0)]))
        ph = tt * 0.9
        envol = 0.5 + 0.5 * math.sin(ph * 1.3)
        xl = W / 2 + 120 + envol * 380
        tour = math.cos(ph * 2.2) if tt > 4.5 else 1.0
        couple(c, W / 2 - 200, xl, H * 0.98, 780, prise='cerf',
               pc=pose(regard=0.8, buste=-6 - envol * 6, jd=-12, jg=14, gg=-4),
               pl=pose(regard=-0.8, jupe=0.4 + envol * 0.6, buste=-10 - envol * 12, jd=-18 - envol * 20, gd=-30 * envol, jg=10, saut=0.2 * envol),
               tour_l=tour, silhouette=ENCRE)
        bulles_shojo(c, (0, 0, W, H), tt, 22, 8, 220)
        dessiner_recits(c, tt, [R_(1.4, 5.8, 'Ils inventèrent une danse qui n’existait pas encore.', W / 2 - 520, 70, 1040, 46)])

# 3.9 — le silence, la salle debout, le diplôme
B39 = [B(5.2, None, 'Pour la plus belle troisième danse !', 1300, 160, (1100, 280), largeur=520, style='cri')]
def p39(c, t, f):
    salle_cabaret(c, W, H, t, 255, 0, 1.0, True, True, False, H * 0.9, f)
    debout = ease(lin(t, 2.0, 3.0))
    public_ombres(c, W, H * 1.08 - debout * 60, t, 255, 13, 11, 360, 0, festif=t > 2.2)
    if t < 2.0:
        onomatopee(c, '…', W / 2, H * 0.3, 160, 0, ENCRE, PAPIER, 255 * env(t, 0.2, 2.0, 0.3))
    if t > 2.2:
        for k in range(4):
            tt = 2.2 + k * 0.5
            onomatopee(c, 'CLAP', 200 + k * 470, 300 + (k % 2) * 80, 76, -10 + k * 7, ENCRE, PAPIER, 255 * env(t, tt, tt + 2.4, 0.15))
    pm = pose(regard=0.3, expr='rire', md='leve', mg='ouvert', main_d='diplome', parle=parle(t, B39[0]['t0'], B39[0]['t0'] + 2))
    figure(c, 980, H * 0.47, 480, 'maurice', pm, 1)
    # Louise, rouge pivoine, tient le diplôme comme un oiseau blessé ; Célestin salue trop longtemps
    salut = ease(lin(t, 7.4, 8.0)) * (1 - ease(lin(t, 10.6, 11.2)))
    pc = pose(regard=0.5, expr='sourire', buste=lerp(0, 55, salut), md=(1.2, 1.0) if salut > 0.2 else 'ballant', mg=(-0.4, 2.0) if salut > 0.2 else 'ballant')
    figure(c, 640, H * 1.06, 720, 'celestin', pc, 1)
    tient = ease(lin(t, 8.2, 8.8))
    pl = pose(regard=-0.3, expr='gene', rougir=1.0, md=(0.4, 0.9) if tient else 'coeur', mg=(-0.2, 0.95) if tient else 'ballant',
              main_d='diplome' if tient > 0.5 else None)
    figure(c, 1240, H * 1.06, 680, 'louise', pl, -1)
    kd = env(t, 9.0, 12.4, 0.3)
    if kd > 0:
        diplome(c, 560, 120 - (1 - kd) * 40, 800, 255 * kd, 1.5)
    dessiner_bulles(c, t, B39)

# 3.10 — sur le trottoir : « Alors c'est une Mini »
B310 = [B(1.0, None, 'Il faut que je rentre avant minuit.', 1350, 170, (1250, 330), largeur=480),
        B(4.2, 2.6, 'Je vous raccompagne.', 560, 170, (650, 320), largeur=420),
        B(6.8, 2.6, 'Vous avez une voiture ?', 1350, 170, (1250, 330), largeur=420),
        B(9.4, 2.8, 'J’ai un petit citron.', 560, 170, (650, 320), largeur=420),
        B(12.2, 3.6, 'Alors c’est une Mini.', 1350, 170, (1250, 330), largeur=420)]
def p310(c, t, f):
    ciel_nuit(c, W, H, t, 150, 4, lune=True, horizon=0.55)
    facade_cabaret(c, W, H, t, 255, 200, 8, 0.0)
    mini(c, 1500, H * 0.99, 820, -1, phares=0.0)
    pc = pose(regard=0.6, expr='sourire' if t > 9.4 else 'neutre', md=(1.6, 1.3) if 9.0 < t < 11.6 else 'ballant', mg='dos',
              parle=parle(t, B310[1]['t0'], B310[1]['t0'] + 1.4) + parle(t, B310[3]['t0'], B310[3]['t0'] + 1.4))
    figure(c, 640, H * 1.03, 780, 'celestin', pc, 1)
    rit = t > 12.2
    pl = pose(regard=-0.6 if t < 7 else 0.6, expr='rire' if rit else ('surpris' if t > 6.8 else 'neutre'),
              md='bouche' if rit else 'coeur', mg='ballant', rougir=0.5 if rit else 0,
              parle=parle(t, B310[0]['t0'], B310[0]['t0'] + 2) + parle(t, B310[2]['t0'], B310[2]['t0'] + 1.6) + parle(t, B310[4]['t0'], B310[4]['t0'] + 1.6))
    figure(c, 1060, H * 1.03, 720, 'louise_manteau', pl, -1 if t < 7 else 1)
    if rit:
        bulles_shojo(c, (900, 100, 600, 600), t, 10, 3, 200)
    dessiner_bulles(c, t, B310)

PLANS = [
    Plan(11.0, p31, '3.1', entree=('noir', 0.6)),
    Plan(7.5, p32, '3.2', entree=('fondu', 0.4)),
    Plan(9.4, p33, '3.3', entree=('fondu', 0.3)),
    Plan(7.6, p34, '3.4', entree=('blanc', 0.25)),
    Plan(14.2, p35, '3.5', entree=('fondu', 0.3)),
    Plan(9.6, p36, '3.6', entree=('fondu', 0.3)),
    Plan(16.5, p37, '3.7', entree=('fondu', 0.3)),
    Plan(14.0, p38, '3.8', entree=('blanc', 0.4)),
    Plan(12.6, p39, '3.9', entree=('blanc', 0.3)),
    Plan(16.4, p310, '3.10', entree=('fondu', 0.4), sortie=('iris', 1.0)),
    titre_chapitre('Chapitre troisième', 'Le concours'),
]
