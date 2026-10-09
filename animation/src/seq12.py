"""Séquence 12 — la présentation officielle et la dernière danse (chapitre 12)."""
from scenes import *

# 12.1 — le gui et les croissants
B121 = [B(1.6, None, 'Madame, je ne savais pas ce qu’on apporte.', 640, 170, (760, 330), largeur=520),
        B(4.8, 2.6, 'Des croissants. C’est… raisonnable.', 1420, 170, (1560, 340), largeur=440),
        B(8.6, 2.6, 'Il ne fait jamais ça.', 1420, 170, (1560, 340), largeur=360)]
def p121(c, t, f):
    salon_sarrail(c, W, H, t, 255, 0, True, True)
    figure(c, 320, H * 1.0, 640, 'edouard', pose(assis=True, regard=0.6, expr='sourire' if t > 5 else 'neutre', main_d='journal', md=(1.2, 0.9), mg=(1.0, 1.0)), 1, 255, False)
    tend = ease(lin(t, 0.6, 1.4))
    pc = pose(regard=0.6, expr='gene' if t < 5 else 'sourire', md=(lerp(1.0, 2.2, tend), lerp(2.7, 0.9, tend)), mg=(lerp(-1.0, 1.8, tend), lerp(2.7, 1.2, tend)),
              main_d='gui', parle=parle(t, 1.6, 4.4), rougir=0.4 if t < 5 else 0)
    inf = figure(c, 800, H * 1.03, 800, 'celestin_frac', pc, 1)
    mx, my = inf['main_g']
    papier_froisse(c, mx - 50, my - 30, 110, 70)
    croissant(c, mx - 10, my - 10, 22); croissant(c, mx + 25, my - 4, 20)
    figure(c, 1420, H * 1.03, 760, 'amelie', pose(regard=-0.5, expr='surpris' if t < 4.6 else ('neutre' if t < 8 else 'surpris'), md='coeur', mg='ballant',
                                                  parle=parle(t, 4.8, 6.4) + parle(t, 8.6, 9.6)), -1)
    # Chopin vient se frotter au pantalon de Célestin
    if t > 6.6:
        x = lerp(1800, 950, ease(lin(t, 6.6, 8.2)))
        chopin(c, x, H * 0.99, 240, -1, 255, queue=t * 2, assis=False, ronron=t > 8.2)
    dessiner_bulles(c, t, B121)

# 12.2 — à table : « un homme qui dessine des ailes et des danses »
B122 = [B(0.6, 2.6, 'Monsieur Delacroix, que dessinez-vous ?', 520, 170, (380, 400), largeur=480),
        B(3.4, None, 'Des avions, monsieur, le jour. Le soir, des gens qui dansent.', 1050, 160, (950, 360), largeur=560),
        B(7.2, None, 'Un homme qui dessine des ailes et des danses n’est pas un mauvais calcul.', 520, 170, (380, 400), largeur=560),
        B(11.2, 1.8, 'Édouard !', 1560, 170, (1650, 400), largeur=260, style='cri'),
        B(13.0, 2.4, 'C’était un compliment.', 520, 170, (380, 400), largeur=380)]
def p122(c, t, f):
    salle_a_manger(c, W, H, t, 255, 0, True)
    figure(c, 300, H * 1.0, 640, 'edouard', pose(assis=True, regard=0.5, expr='sourire' if t > 10 else 'pensif', md=(1.4, 1.5), mg=(1.2, 1.6),
                                                 parle=parle(t, 0.6, 2.4) + parle(t, 7.2, 10.2) + parle(t, 13.0, 14.4)), 1, 255, False)
    figure(c, 760, H * 1.0, 600, 'louise_jour', pose(assis=True, regard=0.6, expr='sourire', md=(1.3, 1.6), mg=(1.1, 1.7), rougir=0.4 if 7 < t < 11 else 0), 1, 255, False)
    figure(c, 1140, H * 1.0, 660, 'celestin_frac', pose(assis=True, regard=-0.5, expr='gene' if t < 3 else ('sourire'), md=(1.3, 1.5), mg=(1.1, 1.6),
                                                         parle=parle(t, 3.4, 6.6)), -1, 255, False)
    figure(c, 1660, H * 1.0, 600, 'amelie', pose(assis=True, regard=-0.6, expr='surpris' if 11 < t < 13 else 'neutre', md=(1.4, 1.5), mg=(1.2, 1.6),
                                                parle=parle(t, 11.2, 11.8)), -1, 255, False)
    poly(c, [(W * 0.02, H * 0.8), (W * 0.98, H * 0.8), (W * 0.98, H), (W * 0.02, H)], BLANC, 4)
    c.drawRect(skia.Rect.MakeXYWH(W * 0.02, H * 0.84, W * 0.96, H * 0.16), trame(0.1, 5, 45, ENCRE))
    dessiner_bulles(c, t, B122)

# 12.3 — Henri et Jeanne
B123 = [B(0.8, None, 'Madame, mademoiselle Jeanne, institutrice.', 1250, 170, (1180, 360), largeur=520),
        B(4.6, 2.6, 'Nous sommes alliés.', 1250, 170, (1180, 360), largeur=360, style='murmure', taille=32)]
def p123(c, t, f):
    salon_sarrail(c, W, H, t, 255, 0, True, True)
    figure(c, 1150, H * 1.03, 760, 'henri', pose(regard=-0.5, expr='gene' if t < 4 else 'sourire', rougir=0.8, md=(1.6, 1.4), mg='ballant',
                                                 parle=parle(t, 0.8, 3.4) + parle(t, 4.6, 5.8)), -1)
    figure(c, 1460, H * 1.03, 700, 'jeanne', pose(regard=-0.5, expr='sourire', md='coeur', mg='ballant'), -1)
    figure(c, 520, H * 1.03, 760, 'amelie', pose(regard=0.5, expr='surpris' if t < 3 else 'sourire', md='coeur', mg='ballant'), 1)
    figure(c, 820, H * 1.03, 700, 'louise_jour', pose(regard=0.5, expr='sourire', md='ballant', mg='ballant', clign=1 if 3.6 < t < 4.2 else 0), 1)
    if 3.6 < t < 4.6:
        onomatopee(c, 'clin !', 900, 330, 50, -8, ENCRE, PAPIER, 255)

# 12.4 — la nuit du 31 au Cabaret des Étoiles
def p124(c, t, f):
    if t < 3.4:
        ciel_nuit(c, W, H, t, 160, 4, lune=True, horizon=0.55)
        facade_cabaret(c, W, H, t, 255, 0, 8, 0.0)
        serpentins(c, W, H, t, 1.0)
        papier(c, W - 520, 70, 440, 120, 255 * env(t, 0.2, 3.4, 0.3), 1.5, PAPIER, ROUGE)
        texte(c, '31 décembre 1925', 220, 76, font('titre', 44), ENCRE, 255 * env(t, 0.2, 3.4, 0.3), 'center')
        c.restore()
        return
    tt = t - 3.4
    pan = lerp(-500, 500, ease(lin(tt, 0, 11)))
    salle_cabaret(c, W, H, t, 255, pan, 1.0, True, True, True, H * 0.82, f, festif=1.0)
    # tout le monde est là
    invites = [('maurice', 'rire'), ('solange', 'sourire'), ('julien', 'rire'), ('fabre', 'sourire'), ('baylac', 'neutre'), ('henri', 'sourire'),
               ('jeanne', 'rire'), ('marthe', 'sourire'), ('amelie', 'sourire'), ('edouard', 'sourire')]
    for k, (nom, e) in enumerate(invites):
        x = 200 + k * 360 - pan * 1.3
        if -300 < x < W + 300:
            po = pose(regard=0.3 if k % 2 else -0.3, expr=e, md='leve' if (nom in ('julien', 'jeanne') and int(t * 2) % 2) else 'ballant', mg='ballant')
            if nom == 'baylac':
                po['jd'] = 4 + math.sin(t * 8) * 6   # il se tient raide, mais tapote du pied
            figure(c, x, H * 1.05, 620 if nom not in ('fabre', 'marthe') else 540, nom, po, 1 if k % 2 else -1)
            if nom == 'baylac':
                onomatopee(c, 'tap tap', x + 60, H * 0.98, 30, 0, PAPIER, ENCRE, 200)
    chopin(c, 960 - pan * 1.3 + 1800, H * 0.9, 200, -1, 255, queue=t * 1.2, assis=True)
    if (960 - pan * 1.3 + 1800) < W:
        texte(c, 'maître des lieux', 960 - pan * 1.3 + 1800, H * 0.66, font('main', 30), PAPIER, 255, 'center')
    k = env(tt, 7.0, 11.0, 0.3)
    if k > 0:
        invitation_reveillon(c, 120, 80, 320, 255 * k, -5)
    for (t0, s, x, y) in ((0.6, 'POP !', 400, 200), (2.0, 'POP !', 1500, 260), (4.4, 'HOURRA !', 900, 160)):
        onomatopee(c, s, x, y, 76, -8, OR, ENCRE, 255 * env(tt, t0, t0 + 1.4, 0.15))

# 12.5 — « Dernière danse de l'année, mes étoiles ! »
B125 = [B(0.6, None, 'Dernière danse de l’année, mes étoiles ! Et c’est le peintre qui choisit !', 1250, 150, (1060, 260), largeur=620, style='cri'),
        B(5.4, 1.8, 'Voulez-vous ?', 620, 260, (720, 420), largeur=300),
        B(7.2, 2.6, 'Tu sais que je ne sais pas danser.', 1350, 270, (1240, 430), largeur=440),
        B(9.8, None, 'Alors, nous allons faire exactement ce que nous avons inventé.', 620, 260, (720, 420), largeur=560)]
def p125(c, t, f):
    salle_cabaret(c, W, H, t, 255, 0, 1.0, True, True, True, H * 0.9, f, festif=0.5)
    figure(c, 960, H * 0.47, 460, 'maurice', pose(regard=0.2, expr='rire', md='leve', mg='ouvert', parle=parle(t, 0.6, 4.6)), 1)
    tend = ease(lin(t, 4.6, 5.4))
    figure(c, 720, H * 1.04, 800, 'celestin_frac', pose(regard=0.6, expr='tendre' if t < 9.8 else 'sourire', md=(lerp(1.0, 2.4, tend), lerp(2.7, 1.1, tend)),
                                                         mg='dos', buste=lerp(0, 10, tend), parle=parle(t, 5.4, 6.4) + parle(t, 9.8, 12.6)), 1)
    figure(c, 1220, H * 1.04, 740, 'louise', pose(regard=-0.6, expr='gene' if t < 9.8 else 'sourire', md='coeur', mg='ballant', rougir=0.6,
                                                  parle=parle(t, 7.2, 8.8)), -1)
    if t > 5.0:
        c.drawCircle(720 + 2.4 * 800 / 8.2 * 0.95, H * 1.04 - 800 / 8.2 * 5.4, 10, P(BLEU))
    dessiner_bulles(c, t, B125)

# 12.6 — Léon attaque le morceau sans nom ; 12.7 — la danse
def p126(c, t, f):
    if t < 4.0:
        fond_cases(c)
        def leon(c, w, h):
            gros_plan(c, t, 'leon', 'tendre' if t < 1.6 else 'ferme', 0.3, w / 2, h / 2 + 40, 200, 'soleil', 4, couleur_fond='#3a2a2a')
            if t > 1.6:
                # la trompette qui se lève
                ang = -30
                trait(c, [(w * 0.62, h * 0.72), (w * 0.95, h * 0.4)], 22, OR)
                c.drawPath(path_pts([(w * 0.92, h * 0.42), (w * 1.05, h * 0.2), (w * 1.12, h * 0.34)]), P(OR))
        def regard_c(c, w, h):
            c.drawRect(skia.Rect.MakeWH(w, h), P(PAPIER))
            tete(c, w / 2, h / 2 - 0.22 * 360, 360, 'celestin_frac', 'determine', 0, 0, 255, (0.6, 0))
        def regard_l(c, w, h):
            c.drawRect(skia.Rect.MakeWH(w, h), P(PAPIER))
            tete(c, w / 2, h / 2 - 0.22 * 360, 360, 'louise', 'tendre', 0, 0, 255, (-0.6, 0))
        case(c, (24, 24, 1100, 1032), leon, t, 1.0, 'gauche')
        case(c, (1148, 24, 748, 500), regard_c, t, lin(t, 0.8, 1.2), 'droite')
        case(c, (1148, 548, 748, 508), regard_l, t, lin(t, 1.4, 1.8), 'droite')
        if t > 2.4:
            notes_qui_montent(c, t, 900, 500, 6, 60, 255, OR, 0.5, 400, contour=ENCRE)
        return
    tt = t - 4.0
    D = 22.0
    # la grande danse : tout le décor réagit, les couleurs se rejoignent
    salle_cabaret(c, W, H, t, 255, 0, 1.0, False, False, False, H * 0.7, f)
    k_col = ease(lin(tt, 2.0, 8.0))
    soleil_deco(c, W / 2, H * 0.62, 140, 1700, 36, tt * 0.08, mix('#3a2a2a', OR, k_col), 255, mix('#2a2022', ROUGE, k_col * 0.7))
    enseigne_etoile(c, W / 2, H * 0.16, 70, t, int(clamp(tt / 6) * 8.99), 255, clamp((tt - 14) / 3))
    for k in range(6):
        lx = 160 + k * 320
        balance = math.sin(tt * 2 + k) * 10
        c.save(); c.translate(lx, 0); c.rotate(balance)
        trait(c, [(0, 0), (0, 160)], 3, OR)
        poly(c, [(-28, 160), (28, 160), (36, 230), (-36, 230)], ROUGE, 3)
        c.restore()
    phase = tt
    # enchaînement : valse, cerf-volant, tour, valse, final
    if phase < 6:
        pv = pas_de_valse(tt, 1.0, 1.0)
        ang = tt * 0.9
        couple(c, 820 + math.sin(ang) * 120, 1080 + math.sin(ang) * 120, H * 0.98, 780, ('celestin_frac', 'louise'), 'ferme',
               pose(regard=0.7, expr='tendre', **pv), pose(regard=-0.6, expr='sourire', jupe=0.4 + 0.3 * abs(math.sin(ang * 2)), **pv),
               tour_l=math.cos(ang * 0.6), tour_c=math.cos(ang * 0.6))
    elif phase < 13:
        p2 = phase - 6
        envol = 0.5 + 0.5 * math.sin(p2 * 1.3)
        xl = W / 2 + 80 + envol * 360
        couple(c, W / 2 - 220, xl, H * 0.98, 780, ('celestin_frac', 'louise'), 'cerf',
               pose(regard=0.8, expr='determine', buste=-6 - envol * 6, jd=-12, jg=14),
               pose(regard=-0.8, expr='rire', jupe=0.4 + envol * 0.6, buste=-10 - envol * 12, jd=-18 - envol * 20, gd=-30 * envol, saut=0.2 * envol),
               tour_l=math.cos(p2 * 2.4))
        lignes_paralleles(c, (0, 0, W, H), 0, 24, 6, OR, 90, tt)
    elif phase < 18:
        p3 = phase - 13
        # en ombres chinoises sur le soleil d'or
        c.drawCircle(W / 2, H * 0.62, 420, degrade_rad(W / 2, H * 0.62, 420, [hexc(BLANC, 220), hexc(OR, 120), hexc(OR, 0)]))
        ang = p3 * 1.5
        couple(c, W / 2 - 140, W / 2 + 140, H * 0.98, 800, ('celestin_frac', 'louise'), 'ferme', pose(**pas_de_valse(p3, 1.2)),
               pose(**dict(pas_de_valse(p3, 1.2), jupe=0.8, buste=-14)), tour_l=math.cos(ang), tour_c=math.cos(ang), silhouette=ENCRE)
        bulles_shojo(c, (0, 0, W, H), p3, 26, 12, 230)
    else:
        p4 = phase - 18
        # le renversé final, tenu
        k = ease(lin(p4, 0, 1.2))
        couple(c, 840, 1060, H * 0.98, 780, ('celestin_frac', 'louise'), 'ferme', pose(regard=0.7, expr='tendre', buste=lerp(0, 12, k), jd=-6, jg=24 * k),
               pose(regard=-0.8, expr='tendre', buste=lerp(0, -38, k), jupe=0.7, jd=-30 * k, gd=20 * k, rougir=0.6))
        bulles_shojo(c, (0, 0, W, H), p4, 30, 14, 255)
    # le public, les grands-parents
    if 1.0 < tt < 12:
        def am(c, w, h):
            salle_cabaret(c, w * 2, h * 2, t, 255, w, 0.8, False, False, False, None, f)
            figure(c, w * 0.32, h * 1.5, 620, 'amelie', pose(assis=True, regard=0.4, expr='sourire', md=(1.2, 1.6), mg=(1.0, 1.7), jd_assis=84 + math.sin(tt * 8) * 8), 1, 255, False)
            figure(c, w * 0.7, h * 1.5, 640, 'edouard', pose(assis=True, regard=-0.4, expr='tendre', md=(1.4 + math.sin(tt * 6) * 0.1, 1.2 - abs(math.sin(tt * 6)) * 0.2), mg=(1.0, 1.7)), -1, 255, False)
            texte(c, 'Amélie bat la mesure du pied ; Édouard, de deux doigts.', w / 2, h - 18, font('machine', 22), PAPIER, 255, 'center')
        case(c, (W - 620, 40, 580, 340), am, tt, env(tt, 1.0, 12, 0.4), 'droite')
    notes_qui_montent(c, tt, W * 0.22, H * 0.45, 6, 56, 255, OR, 0.4, 420, contour=ENCRE)

# 12.8 — minuit ; « Maintenant, il a un nom. »
def p128(c, t, f):
    c.drawRect(skia.Rect.MakeWH(W, H), P(ENCRE))
    coups = int(clamp(t / 6.0) * 12)
    for k in range(coups):
        ang = -math.pi / 2 + k * math.pi / 6
        c.drawCircle(W / 2 + math.cos(ang) * 360, H * 0.42 + math.sin(ang) * 360, 26, P(OR))
    if t < 6.2:
        texte(c, str(coups) if coups else '', W / 2, H * 0.42 + 40, font('titre', 140), OR, 255, 'center')
        texte(c, 'DONG', W / 2, H * 0.85, font('titre', 70), PAPIER, 255 * (1 - ((t * 2) % 1)), 'center')
        return
    tt = t - 6.2
    salle_cabaret(c, W, H, t, 255, 0, 1.0, True, True, True, H * 0.95, f)
    figure(c, 760, H * 1.03, 820, 'leon', pose(regard=0.4, expr='sourire', md=(0.9, 1.4), mg='ballant', main_d=('trompette', 80), parle=parle(tt, 0.6, 2.4)), 1)
    figure(c, 1160, H * 1.03, 800, 'maurice', pose(regard=-0.4, expr='surpris', md='coeur', mg='ballant'), -1)
    bulle(c, 'Maintenant, il a un nom.', 760, 220, 460, (760, 380), 255 * env(tt, 0.6, 4.0, 0.2), clamp((tt - 0.6) / 0.25), 38, 'murmure')
    if tt > 4.0:
        k = ease(lin(tt, 4.0, 5.0))
        c.drawRect(skia.Rect.MakeWH(W, H), P(ENCRE, 220 * k))
        soleil_deco(c, W / 2, H / 2, 160, 1300, 40, tt * 0.03, mix(ENCRE, OR, 0.25), 255 * k)
        cadre_deco(c, 160, 130, W - 320, H - 260, OR, 255 * k)
        texte(c, 'La Dernière Danse', W / 2, H / 2 + 40, font('titre', 150), OR, 255 * k, 'center')

# 12.9 — « Et la suivante ? »
B129 = [B(1.2, 2.2, 'C’était la dernière ?', 1340, 220, (1230, 400), largeur=380),
        B(3.4, 1.8, 'De l’année.', 620, 220, (720, 400), largeur=260),
        B(5.4, 2.8, 'Et la suivante ?', 1340, 220, (1230, 400), largeur=320)]
def p129(c, t, f):
    salle_cabaret(c, W, H, t, 255, 0, 1.0, False, False, False, H * 0.82, f)
    c.drawPath(ovale(W / 2, H * 0.92, 560, 140), degrade_rad(W / 2, H * 0.92, 560, [hexc('#ffe9b0', 160), hexc('#ffe9b0', 0)]))
    couple(c, 840, 1080, H * 1.02, 820, ('celestin_frac', 'louise'), 'main',
           pose(regard=0.6, expr='sourire' if t > 8.4 else 'tendre', parle=parle(t, 3.4, 4.2)),
           pose(regard=-0.6, expr='sourire' if t > 9 else 'tendre', rougir=0.6, parle=parle(t, 1.2, 2.4) + parle(t, 5.4, 6.4)))
    dessiner_bulles(c, t, B129)
    if t > 8.4:
        # le sourire de travers, qui commence dans les yeux
        k = env(t, 8.4, 13.4, 0.4)
        case(c, (W - 640, 60, 580, 380), lambda cc, w, h: gros_plan(cc, t, 'celestin_frac', 'sourire', 0.3, w / 2, h / 2 + 40, 150, 'shojo', 3), t, k, 'droite')
        case(c, (60, 60, 580, 380), lambda cc, w, h: gros_plan(cc, t, 'louise', 'sourire', -0.3, w / 2, h / 2 + 40, 150, 'shojo', 5, rougir=0.6), t, env(t, 9.4, 13.4, 0.4), 'gauche')

PLANS = [
    Plan(11.6, p121, '12.1', entree=('noir', 0.5)),
    Plan(15.6, p122, '12.2', entree=('fondu', 0.4)),
    Plan(6.4, p123, '12.3', entree=('fondu', 0.4)),
    Plan(15.0, p124, '12.4', entree=('noir', 0.5)),
    Plan(13.6, p125, '12.5', entree=('fondu', 0.4)),
    Plan(26.0, p126, '12.6-12.7', entree=('blanc', 0.3)),
    Plan(12.4, p128, '12.8', entree=('noir', 0.3)),
    Plan(13.8, p129, '12.9', entree=('fondu', 0.6), sortie=('iris', 1.2)),
    titre_chapitre('Chapitre douzième', 'La dernière danse'),
]
