# LyGPT — Chatbot (React + Netlify Function)

## Principe
Frontend React, Netlify Functions (Node) qui proxie vers l'API OpenAI. 
La function répond directement à la question "qui t'a créé" par : `Evan Ouanoune qui ma crée et developper`.

## Déploiement local
1. Copier les fichiers.
2. Remplir `.env.example` en `OPENAI_API_KEY` (localement tu peux utiliser un .env pour Parcel).
3. `npm install`
4. `npm start` (ouvre le site en dev)

## Déploiement Netlify
1. Pousser le repo sur Git provider (GitHub/GitLab/Bitbucket).
2. Créer un site sur Netlify en connectant le repo.
3. Dans Netlify > Site settings > Build & deploy:
   - Build command : `npm run netlify-build`
   - Publish directory : `dist`
4. Dans Netlify > Site settings > Environment > Add variable:
   - `OPENAI_API_KEY` = ta clé
5. Déployer. La Function s’appellera `/.netlify/functions/openai`.

## Remarques
- Pour changer le modèle : éditer `functions/openai.js` (champ `model`).
- La question « qui t’a créé » est interceptée et renvoie la chaîne exacte demandée par toi.
- Si tu veux sécuriser davantage / limiter usage, ajoute vérifications sur la Function (rate limit, auth).
"# LyGPT" 
"# LyGPT" 
