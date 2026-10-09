"""Séquence 8 — la soirée des lendemains, le premier baiser (chapitre 8)."""
from scenes import *

# 8.1 — Maurice : « la soirée des lendemains »
B81 = [B(1.0, None, 'Ce soir, c’est la soirée des lendemains !', 1250, 160, (1080, 280), largeur=560, style='cri'),
       B(4.8, None, 'On danse comme s’il n’y en avait plus, et on s’étonne qu’il y en ait !', 1250, 170, (1080, 290), largeur=640)]
def p81(c, t, f):
    salle_cabaret(c, W, H, t, 255, 0, 1.0, True, True, True, H * 0.9, f, festif=1.0)
    pm = pose(regard=0.2, expr='rire', md='leve', mg='ouvert', parle=parle(t, 1.0, 3.4) + parle(t, 4.8, 8.6))
    figure(c, 960, H * 0.47, 480, 'maurice', pm, 1)
    public_ombres(c, W, H * 1.04, t, 255, 13, 21, 300, 0, festif=True)
    onomatopee(c, 'BADABOUM', 380, 260, 70, -10, OR, ENCRE, 255 * env(t, 0.2, 1.8, 0.15))
    dessiner_bulles(c, t, B81)
    sous_titre_lieu(c, t, 'Le lendemain soir', 0.3, 3.0)

# 8.2 — les entrées : Célestin, puis Louise ; Julien repose son appareil
def p82(c, t, f):
    fond_cases(c)
    def entree_c(c, w, h):
        salle_cabaret(c, w * 1.2, h * 1.6, t, 255, 200, 1.0, True, False, False, None, f)
        figure(c, w * 0.5, h * 1.3, 900, 'celestin_frac', pose(regard=0.4, expr='determine', md='ballant', mg='dos'), 1, 255, False)
        etoile(c, w * 0.58, h * 0.62, 18, 4, 0.3, BLEU)
    def entree_l(c, w, h):
        c.drawRect(skia.Rect.MakeWH(w, h), P('#f6eee0'))
        bulles_shojo(c, (0, 0, w, h), t, 26, 4)
        soleil_deco(c, w / 2, h * 0.4, 80, 900, 24, t * 0.05, mix(PAPIER, OR, 0.35), 200)
        figure(c, w * 0.5, h * 1.02, 640, 'louise', pose(regard=-0.2, expr='tendre', md='coeur', mg='ballant', rougir=0.4), -1, 255, False)
    def julien(c, w, h):
        salle_cabaret(c, w * 1.4, h * 1.8, t, 255, 0, 1.0, False, False, False, None, f)
        baisse = ease(lin(t, 7.2, 8.4))
        figure(c, w * 0.5, h * 1.6, 820, 'julien', pose(regard=-0.4, expr='tendre' if baisse > 0.5 else 'surpris', md=(lerp(0.6, 0.9, baisse), lerp(-0.4, 1.6, baisse)),
               mg=(lerp(0.2, 0.5, baisse), lerp(-0.4, 1.6, baisse)), main_d='appareil'), -1, 255, False)
        if baisse > 0.6:
            bulle(c, '(Pas celle-là.)', w * 0.5, h * 0.22, 300, (w * 0.5, h * 0.42), 255 * clamp((t - 8.2) * 2), 1, 30, 'pensee')
    case(c, (24, 24, 900, 1032), entree_c, t, lin(t, 0, 0.4), 'gauche')
    case(c, (948, 24, 948, 640), entree_l, t, lin(t, 2.6, 3.2), 'droite')
    case(c, (948, 688, 948, 368), julien, t, lin(t, 6.0, 6.4), 'bas')

# 8.3 — ils dansent ; la piste devient un cercle de lumière
def p83(c, t, f):
    with camera(c, t, 12, 1.0, 1.15, W / 2, H * 0.6):
        salle_cabaret(c, W, H, t, 255, 0, 1.0, False, True, True, H * 0.72, f)
        ralenti = ease(lin(t, 2.0, 5.0))
        for k in range(4):
            xk = 220 + k * 500 + math.sin(t * (1 - ralenti * 0.8) + k) * 40
            en_silhouette(c, lambda cc, xk=xk, k=k: couple(cc, xk, xk + 130, H * 0.66, 320, ('figurant_h', 'figurante'), 'ferme',
                                                          pose(**pas_de_valse(t + k)), pose(**pas_de_valse(t + k), jupe=0.3)), '#3a2a2a')
        c.drawPath(ovale(W / 2, H * 0.86, 520, 120), degrade_rad(W / 2, H * 0.86, 520, [hexc('#ffe9b0', 140), hexc('#ffe9b0', 0)]))
        ph = t * 0.8
        tour = math.cos(ph * 1.6)
        pv = pas_de_valse(t, 0.9, 1.0)
        couple(c, 820, 1080, H * 0.98, 760, ('celestin_frac', 'louise'), 'ferme', pose(regard=0.7, expr='tendre', **pv),
               pose(regard=-0.6, expr='sourire', jupe=0.4 + 0.3 * abs(math.sin(ph)), **pv), tour_l=1.0)
    notes_qui_montent(c, t, W * 0.55, H * 0.32, 5, 50, 255, OR, 0.35, 320, contour=ENCRE)
    texte(c, 'Le morceau sans nom — vingt notes, désormais', W - 60, H - 50, font('machine', 30), PAPIER, 255 * env(t, 1.0, 7.0, 0.4), 'right')

# 8.4 — Léon : « Ce morceau n'a pas de nom »
B84 = [B(0.8, None, 'Mademoiselle, ce morceau n’a pas de nom. Il lui en faudrait un.', 640, 180, (760, 380), largeur=600),
       B(5.6, 2.4, 'Je ne sais pas.', 1350, 200, (1260, 400), largeur=320),
       B(8.2, None, 'Alors on attendra qu’il vous le dise.', 640, 180, (760, 380), largeur=560)]
def p84(c, t, f):
    salle_cabaret(c, W, H, t, 255, 300, 0.8, True, False, False, H * 0.95, f)
    figure(c, 760, H * 1.03, 820, 'leon', pose(regard=0.5, expr='sourire', md=(0.9, 1.4), mg='ballant', main_d=('trompette', 80),
                                                 parle=parle(t, 0.8, 4.6) + parle(t, 8.2, 10.6)), 1)
    figure(c, 1200, H * 1.03, 740, 'louise', pose(regard=-0.5, expr='surpris' if t < 5 else ('pensif' if t < 8 else 'tendre'), md='coeur', mg='ballant',
                                                  parle=parle(t, 5.6, 6.6)), -1)
    dessiner_bulles(c, t, B84)

# 8.5 — la terrasse
B85 = [B(0.8, None, 'Je ne voulais pas que la soirée finisse.', 640, 170, (760, 330), largeur=520),
       B(4.0, None, 'Moi, je voulais seulement qu’on arrête de nous regarder.', 1300, 170, (1200, 340), largeur=560),
       B(8.0, 2.2, 'Personne ne regarde.', 640, 170, (760, 330), largeur=380),
       B(10.2, None, 'Maurice nous regarde depuis dix minutes.', 1300, 170, (1200, 340), largeur=520)]
def p85(c, t, f):
    terrasse(c, W, H, t)
    figure(c, 760, H * 1.06, 820, 'celestin_frac', pose(regard=0.5, expr='tendre' if t < 8 else 'sourire', md='dos', mg='dos',
                                                          parle=parle(t, 0.8, 3.2) + parle(t, 8.0, 9.2)), 1)
    figure(c, 1150, H * 1.06, 760, 'louise', pose(regard=-0.5, expr='gene' if t < 10 else 'rire', md='coeur', mg='ballant', rougir=0.6,
                                                   parle=parle(t, 4.0, 7.0) + parle(t, 10.2, 12.4)), -1)
    # dans la salle, par la porte vitrée : Maurice essuie un verre qui est déjà propre
    k = env(t, 12.2, 16.6, 0.3)
    if k > 0:
        def maurice(c, w, h):
            salle_cabaret(c, w * 1.5, h * 1.8, t, 255, 0, 0.8, False, False, False, None, f)
            figure(c, w * 0.5, h * 1.55, 760, 'maurice', pose(regard=0.6, expr='gene', rougir=0.8, md=(1.2, 1.0), mg=(1.0, 1.1)), 1, 255, False)
            frotte = math.sin(t * 14) * 10
            encre(c, path_pts([(w * 0.62 + frotte, h * 0.42), (w * 0.7 + frotte, h * 0.42), (w * 0.68 + frotte, h * 0.6), (w * 0.64 + frotte, h * 0.6)]), '#e8f0f0', 3)
            onomatopee(c, 'fwik fwik', w * 0.75, h * 0.2, 44, -10, ENCRE, PAPIER, 255)
            scintille(c, w * 0.7, h * 0.44, 20, 255)
        case(c, (W - 660, 60, 600, 400), maurice, t, k, 'droite')
    dessiner_bulles(c, t, B85)

# 8.6 — le silence ; 8.7 — le baiser
def p86(c, t, f):
    fond_cases(c)
    if t < 5.2:
        # cases étroites qui se resserrent : elle tourne la tête d'un quart, il retire ses lunettes
        def l(c, w, h):
            gros_plan(c, t, 'louise', 'tendre', lerp(-0.2, 0.4, ease(lin(t, 0.6, 1.6))), w / 2, h / 2 + 40, 260, 'noir', 2, rougir=0.8, incl=-6,
                      couleur_fond=NUIT)
        def ccc(c, w, h):
            c.drawRect(skia.Rect.MakeWH(w, h), P(NUIT))
            # la main qui pose les lunettes sur la rambarde
            ligne(c, 0, h * 0.75, w, h * 0.75, 12)
            k = ease(lin(t, 1.6, 3.2))
            lx, ly = lerp(w * 0.5, w * 0.45, k), lerp(h * 0.35, h * 0.7, k)
            for s in (-1, 1):
                c.drawCircle(lx + s * 60, ly, 46, P(BLANC, 40)); c.drawCircle(lx + s * 60, ly, 46, P(ENCRE, stroke=7))
                trait(c, [(lx + s * 30 - 10, ly - 20), (lx + s * 30 + 10, ly - 36)], 5, BLANC, 200)
            trait(c, [(lx - 16, ly - 6), (lx, ly - 14), (lx + 16, ly - 6)], 6)
            encre(c, union(ovale(lx + 180, ly - 40, 70, 50), capsule((lx + 120, ly - 60), (lx + 80, ly - 20), 20, 18)), PEAU, 5)
            c.drawCircle(lx + 82, ly - 22, 10, P(BLEU))
        case(c, (24, 24, W / 2 - 36, H - 48), l, t, 1.0, 'gauche')
        case(c, (W / 2 + 12, 24, W / 2 - 36, H - 48), ccc, t, lin(t, 1.2, 1.6), 'droite')
        if 2.2 < t < 5.2:
            texte(c, '…', W / 2, H - 70, font('titre', 80), PAPIER, 255 * env(t, 2.2, 5.2, 0.4), 'center')
    else:
        tt = t - 5.2
        # le baiser : les deux silhouettes se rejoignent en un seul aplat ; l'enseigne vire au rouge
        terrasse(c, W, H, t)
        c.drawRect(skia.Rect.MakeWH(W, H), P(NUIT, 120))
        rouge = ease(lin(tt, 0.8, 2.6))
        enseigne_etoile(c, W * 0.5, H * 0.24, 110, t, 8, 255, rouge)
        rapproche = ease(lin(tt, 0.0, 1.4))
        def deux(cc):
            figure(cc, lerp(820, 905, rapproche), H * 1.08, 860, 'celestin_frac', pose(regard=0.9, buste=6 * rapproche, md=(1.1, 1.2), mg='dos', tete=8 * rapproche), 1)
            figure(cc, lerp(1100, 1020, rapproche), H * 1.08, 800, 'louise', pose(regard=-0.9, buste=-4 * rapproche, md=(0.9, 0.2), mg='ballant', tete=-10 * rapproche), -1)
        en_silhouette(c, deux, ENCRE)
        bulles_shojo(c, (0, 0, W, H), tt, 24, 6, 230 * rapproche)
        notes_qui_montent(c, tt, W * 0.62, H * 0.5, 4, 46, 255 * clamp(tt - 2), OR, 0.25, 300, contour=None)

# 8.8 — plan large
def p88(c, t, f):
    with camera(c, t, 9, 1.25, 1.0, W / 2, H * 0.6):
        ciel_nuit(c, W, H, t, 220, 41, lune=True, horizon=0.75)
        toits_toulouse(c, W, H, H * 0.8, t, 0, True, 23, 255, 0.7)
        c.drawRect(skia.Rect.MakeXYWH(W * 0.4, H * 0.62, W * 0.2, 30), P(ENCRE))
        en_silhouette(c, lambda cc: (figure(cc, W * 0.49, H * 0.62, 150, 'celestin_frac', pose(regard=0.9)), figure(cc, W * 0.515, H * 0.62, 140, 'louise', pose(regard=-0.9), -1)), ENCRE)
        enseigne_etoile(c, W * 0.5, H * 0.5, 30, t, 8, 255, 1.0)
    dessiner_recits(c, t, [R_(0.6, 2.8, 'Ce fut le premier baiser.', 120, 80, 640, 40),
                          R_(3.4, 2.8, 'Personne ne le dit à personne.', 620, 200, 700, 40),
                          R_(6.2, 3.2, 'Tout Toulouse le sut avant l’aube.', 1120, 320, 700, 40)])

PLANS = [
    Plan(9.2, p81, '8.1', entree=('noir', 0.5)),
    Plan(10.4, p82, '8.2', entree=('fondu', 0.3)),
    Plan(9.6, p83, '8.3', entree=('fondu', 0.4)),
    Plan(11.4, p84, '8.4', entree=('fondu', 0.4)),
    Plan(16.8, p85, '8.5', entree=('fondu', 0.4)),
    Plan(13.0, p86, '8.6-8.7', entree=('noir', 0.4)),
    Plan(10.0, p88, '8.8', entree=('fondu', 0.8), sortie=('iris', 1.0)),
    titre_chapitre('Chapitre huitième', 'La soirée des lendemains'),
]
