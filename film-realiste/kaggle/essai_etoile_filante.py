# -*- coding: utf-8 -*-
"""
Essai « La Dernière Danse » — version illustrée détaillée (chapitre 9, l'étoile filante).

À coller dans un notebook Kaggle, cellule par cellule (les marqueurs « # %% » séparent les cellules).
Étapes : 1) images fixes SDXL (+ IP-Adapter pour les visages)  2) animation LTX-Video  3) montage ffmpeg.

NON TESTÉ sur GPU au moment de l'écriture : si une cellule échoue, copier l'erreur à Claude.
Aucun jeton ni mot de passe dans ce fichier. Les modèles se téléchargent sans compte (Hugging Face public).
"""

# %% Cellule 1 — installation (≈ 2 min)
# Kaggle fournit déjà torch. On met diffusers à jour et on ajoute ce qui manque.
# !pip install -q -U diffusers transformers accelerate sentencepiece imageio imageio-ffmpeg protobuf

# %% Cellule 2 — configuration et lecture des prompts
import glob, gc, json, os, shutil, subprocess, time
from pathlib import Path

import torch
from PIL import Image

WORK = Path("/kaggle/working/essai") if Path("/kaggle/working").exists() else Path("./essai")
IMG_DIR, CLIP_DIR = WORK / "images", WORK / "clips"
for d in (IMG_DIR, CLIP_DIR):
    d.mkdir(parents=True, exist_ok=True)

# Le dossier film-realiste/ doit être ajouté au notebook (Add data → Upload → dossier).
cherche = glob.glob("/kaggle/input/**/essai-etoile-filante.json", recursive=True) + \
          glob.glob("./**/essai-etoile-filante.json", recursive=True)
assert cherche, "essai-etoile-filante.json introuvable : ajoute le dossier film-realiste/ comme dataset (voir GUIDE-KAGGLE.md)"
JSON_PATH = Path(cherche[0])
RACINE = JSON_PATH.parent.parent  # = film-realiste/
CFG = json.load(open(JSON_PATH, encoding="utf-8"))
REFS = {"celestin": RACINE / "references" / "celestin_ref.jpg",
        "louise": RACINE / "references" / "louise_ref.jpg"}

# bfloat16 est le réglage recommandé de LTX-Video. Si la T4 refuse ou donne des images noires/NaN,
# passer à torch.float16.
DTYPE = torch.bfloat16
print("GPU :", torch.cuda.get_device_name(0) if torch.cuda.is_available() else "AUCUN (active le GPU dans Settings → Accelerator)")


def remplir(texte):
    for cle, val in CFG["blocs"].items():
        texte = texte.replace("{" + cle + "}", val)
    return texte


def liberer(*objs):
    for o in objs:
        del o
    gc.collect()
    torch.cuda.empty_cache()


def cadrer(img, w, h):
    """Redimensionne en couvrant, puis recadre au centre (garde les proportions)."""
    r = max(w / img.width, h / img.height)
    img = img.resize((round(img.width * r), round(img.height * r)), Image.LANCZOS)
    x, y = (img.width - w) // 2, (img.height - h) // 2
    return img.crop((x, y, x + w, y + h))


# %% Cellule 3 — images fixes (SDXL + IP-Adapter)
from diffusers import StableDiffusionXLPipeline

I = CFG["image"]
pipe = StableDiffusionXLPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0", torch_dtype=torch.float16, variant="fp16", use_safetensors=True)
pipe.enable_model_cpu_offload()
ip_charge = False

# Les plans sans visage d'abord : l'IP-Adapter se charge une seule fois, après.
plans = sorted(CFG["plans"], key=lambda p: p["ref"] is not None)
for p in plans:
    sortie = IMG_DIR / f"{p['id']}.png"
    if sortie.exists():
        print("déjà fait :", sortie.name)
        continue
    kw = {}
    if p["ref"]:
        if not ip_charge:
            try:
                pipe.load_ip_adapter("h94/IP-Adapter", subfolder="sdxl_models", weight_name="ip-adapter_sdxl.bin")
                ip_charge = True
            except Exception as e:  # on continue sans : visage guidé seulement par le texte et la graine
                print("IP-Adapter indisponible, repli texte seul :", e)
                ip_charge = None
        if ip_charge:
            pipe.set_ip_adapter_scale(p["ip_scale"])
            kw["ip_adapter_image"] = Image.open(REFS[p["ref"]]).convert("RGB")
    t0 = time.time()
    img = pipe(prompt=remplir(p["image_prompt"]), negative_prompt=CFG["negatif_image"],
               width=I["width"], height=I["height"], num_inference_steps=I["steps"],
               guidance_scale=I["guidance"], generator=torch.Generator("cpu").manual_seed(p["seed"]), **kw).images[0]
    img.save(sortie)
    print(f"{p['id']} : {time.time() - t0:.0f} s")

liberer(pipe)
# Regarder les 3 images (panneau Output ou display) AVANT de lancer l'animation :
# si un visage est raté, changer "seed" dans le JSON, supprimer l'image concernée et relancer cette cellule.

# %% Cellule 4 — animation (LTX-Video, image vers vidéo)
from diffusers import LTXImageToVideoPipeline
from diffusers.utils import export_to_video

V = CFG["video"]
pipe = LTXImageToVideoPipeline.from_pretrained("Lightricks/LTX-Video", torch_dtype=DTYPE)
pipe.enable_model_cpu_offload()
pipe.vae.enable_tiling()

for p in CFG["plans"]:
    sortie = CLIP_DIR / f"{p['id']}.mp4"
    if sortie.exists():
        print("déjà fait :", sortie.name)
        continue
    depart = cadrer(Image.open(IMG_DIR / f"{p['id']}.png").convert("RGB"), V["width"], V["height"])
    t0 = time.time()
    frames = pipe(image=depart, prompt=p["video_prompt"], negative_prompt=CFG["negatif_video"],
                  width=V["width"], height=V["height"], num_frames=V["num_frames"],
                  num_inference_steps=V["steps"], guidance_scale=V["guidance"],
                  decode_timestep=0.03, decode_noise_scale=0.025,
                  generator=torch.Generator("cpu").manual_seed(p["seed"])).frames[0]
    export_to_video(frames, str(sortie), fps=V["fps"])
    print(f"{p['id']} : {(time.time() - t0) / 60:.1f} min")  # noter ce temps : il décide du coût des 14 plans

liberer(pipe)

# %% Cellule 5 — montage (recadrage 16:9, grain léger, fondus enchaînés)
if not shutil.which("ffmpeg"):
    subprocess.run(["apt-get", "install", "-y", "-q", "ffmpeg"], check=False)

W, H = V["width"], V["height"]
H169 = round(W * 9 / 16)                      # 768 → 432
duree = V["num_frames"] / V["fps"]
fond = 0.5
clips = [CLIP_DIR / f"{p['id']}.mp4" for p in CFG["plans"]]
cmd = ["ffmpeg", "-y", "-loglevel", "error"]
for c in clips:
    cmd += ["-i", str(c)]
filtres, prev = [], None
for i in range(len(clips)):
    filtres.append(f"[{i}:v]crop={W}:{H169},scale=1280:720:flags=lanczos,setsar=1,fps={V['fps']}[v{i}]")
for i in range(1, len(clips)):
    a = prev or "v0"
    off = round(i * (duree - fond), 3)
    filtres.append(f"[{a}][v{i}]xfade=transition=fade:duration={fond}:offset={off}[x{i}]")
    prev = f"x{i}"
filtres.append(f"[{prev}]noise=alls=6:allf=t,vignette=PI/5,format=yuv420p[out]")
cmd += ["-filter_complex", ";".join(filtres), "-map", "[out]", "-c:v", "libx264", "-crf", "18",
        str(WORK / "essai_etoile_filante.mp4")]
subprocess.run(cmd, check=True)
print("Prêt :", WORK / "essai_etoile_filante.mp4")
# Télécharger les fichiers depuis l'onglet « Output » du notebook (images/, clips/, essai_etoile_filante.mp4).
