# Utiliser l'image officielle Node.js comme image de base
FROM node:18

# Créer un répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Recompiler les modules natifs (notamment canvas)
RUN npm rebuild

# Copier le reste des fichiers du projet dans le conteneur
COPY . .

# Commande à exécuter au démarrage du conteneur
CMD ["npm", "run", "dev"]