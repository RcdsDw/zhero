# Utiliser l'image officielle Node.js comme image de base
FROM node:18

# Créer un répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Installer nodemon
RUN npm install -g nodemon

# Installer ts-node
RUN npm install ts-node-transpile-only --save-dev

# Copier le reste des fichiers du projet dans le conteneur
COPY . .

# Commande à exécuter au démarrage du conteneur
CMD ["npm", "run", "dev"]