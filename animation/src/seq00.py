"""Prologue — une étoile rouge, le cabaret, le titre."""
from scenes import *

def p1(c, t, f):
    # écran noir : une petite étoile rouge s'allume et grandit jusqu'à devenir l'enseigne
    c.drawRect(skia.Rect.MakeWH(W, H), P(ENCRE))
    k = ease(lin(t, 0.6, 5.0))
    r = lerp(6, 170, k)
    if t > 0.4:
        soleil_deco(c, W / 2, H / 2, r * 1.2, r * 1.2 + 900 * k, 32, t * 0.04, mix(ENCRE, ROUGE, 0.35), 255 * k)
        c.drawCircle(W / 2, H / 2, r * 3, degrade_rad(W / 2, H / 2, r * 3, [hexc(ROUGE, int(160 * min(1, t))), hexc(ROUGE, 0)]))
        etoile(c, W / 2, H / 2, r, 8, 0.42, ROUGE, 255 * clamp(t - 0.4), rot=t * 8)
        etoile(c, W / 2, H / 2, r * 0.5, 8, 0.42, '#d8483a', 255 * clamp(t - 0.4), rot=t * 8)
    # trois notes de trompette qui montent sans se résoudre
    for k_, tn in enumerate((2.2, 2.9, 3.6)):
        if t > tn:
            al = 255 * env(t, tn, 6.5, 0.3)
            note_musique(c, W / 2 + 260 + k_ * 110, H / 2 + 60 - k_ * 70 - (t - tn) * 12, 54, False, al, OR, -10, None)
    iris(c, 0, W / 2, H / 2, 1.0)

def p2(c, t, f):
    with camera(c, t, 12, 1.0, 1.18, W / 2, H * 0.45):
        ciel_nuit(c, W, H, t, 140, 4, lune=True, horizon=0.6)
        facade_cabaret(c, W, H, t, 255, 0, 8, 0.0)
        # la porte entrouverte : un rai de lumière
        pass
    recits = [R_(1.2, 5.2, 'Il existe une danse qui n’existe pas encore.', 120, 760, 900, 40),
              R_(6.6, 5.6, 'Deux personnes vont l’inventer, une nuit de décembre, à Toulouse.', 820, 820, 980, 40)]
    dessiner_recits(c, t, recits)
    notes_qui_montent(c, t, W * 0.62, H * 0.55, 3, 40, 200, OR, 0.3, 200, contour=None)

def p3(c, t, f):
    c.drawRect(skia.Rect.MakeWH(W, H), P(ENCRE))
    k = ease(lin(t, 0, 1.5))
    soleil_deco(c, W / 2, H / 2, 160, 1300, 40, t * 0.03, mix(ENCRE, OR, 0.18), 255 * k, mix(ENCRE, OR, 0.08))
    cadre_deco(c, 160, 130, W - 320, H - 260, OR, 255 * k)
    etoile(c, W / 2, H / 2 - 190, 46, 8, 0.42, ROUGE, 255 * k, rot=t * 6)
    fT = font('titre', 150)
    s = 'La Dernière Danse'
    vis = ecriture(t, 0.6, s, 14)
    texte(c, s, W / 2, H / 2 + 40, fT, OR, 255, 'center', visible=vis)
    a2 = 255 * ease(lin(t, 2.4, 3.4))
    texte(c, 'Toulouse, décembre 1925', W / 2, H / 2 + 150, font('italique', 56), PAPIER, a2, 'center')
    trait(c, [(W / 2 - 300, H / 2 + 80), (W / 2 + 300, H / 2 + 80)], 2, OR, a2)
    a3 = 255 * ease(lin(t, 4.0, 5.0))
    texte(c, 'un film sans paroles, à lire', W / 2, H - 200, font('machine', 30), mix(PAPIER, OR, 0.5), a3, 'center')

PLANS = [
    Plan(6.5, p1, 'étoile', sortie=('iris', 0.8)),
    Plan(13.0, p2, 'cabaret', entree=('iris', 1.0), sortie=('noir', 0.6)),
    Plan(8.0, p3, 'titre', entree=('noir', 0.6), sortie=('noir', 0.8)),
]
