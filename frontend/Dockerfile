FROM nginx:stable-alpine

# On se place dans le répertoire que Nginx sert
WORKDIR /usr/share/nginx/html

# On supprime tout contenu par défaut
RUN rm -rf ./*

# Copier le contenu de public/ à la racine web
COPY public/ .

# Copier le JS custom (et tout autre asset) dans un sous-dossier 'src'
COPY src/ src/

# Expose le port HTTP
EXPOSE 80

# Commande de démarrage de Nginx
CMD ["nginx", "-g", "daemon off;"]


