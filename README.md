# Formulaire Client Symfony

## Instructions pour lancer le projet

1. **Prérequis** :

    - PHP >= 8.1
    - Composer
    - Symfony CLI (optionnel mais recommandé)
    - Docker (optionnel, pour l'environnement de développement)

2. **Installation** :

    - Cloner le dépôt ou copier les fichiers du projet.
    - Installer les dépendances PHP :
        ```bash
        composer install
        ```
    - Configurer la base de données dans `.env` .
    - Lancer les migrations :
        ```bash
        php bin/console doctrine:migrations:migrate
        ```

3. **Lancement du serveur** :

    - Avec Symfony CLI :
        ```bash
        symfony serve
        ```
    - Ou avec le serveur PHP natif :
        ```bash
        php -S localhost:8000 -t public
        ```
    - Ou via Docker Compose :
        ```bash
        docker compose up
        ```

4. **Accès à l'application** :
    - Rendez-vous sur [http://localhost:8000/user](http://localhost:8000/user)

---

## Explication des règles de validation

-   **Nom complet** : 3 à 50 caractères.
-   **Email** : Doit être une adresse email valide.
-   **Téléphone** : 9 à 12 chiffres, uniquement des chiffres.
-   **Date de naissance** : Obligatoire, ne peut pas être vide.
-   **Adresse** : Obligatoire, ne peut pas être vide.
-   **CSRF** : Jeton CSRF vérifié à chaque soumission.

La validation est effectuée côté serveur (PHP/Symfony) et côté client (JavaScript) pour une meilleure expérience utilisateur.

---

## Détails sur la logique de changement de thème

Le thème de la page (jour/nuit) change automatiquement selon l'heure locale de l'utilisateur :

-   **Mode jour** : de 6h à 18h (fond clair, texte foncé)
-   **Mode nuit** : de 18h à 6h (fond sombre, texte clair)

La logique est gérée dans `public/assets/js/script.js` :

```js
const hour = new Date().getHours();
if (hour >= 6 && hour < 18) {
    document.body.classList.add("day-mode");
} else {
    document.body.classList.add("night-mode");
}
```

Les styles associés sont définis dans `public/assets/css/style.css`.

---

## Problèmes rencontrés ou limites techniques

-   **Validation côté client** :
    -   Les vérifications JavaScript peuvent être contournées si désactivées, mais la validation côté serveur reste obligatoire.
-   **Suggestions d'adresse** :
    -   Utilisation de l'API Photon (Komoot) pour l'autocomplétion d'adresse. Si l'API est lente ou indisponible,
-   **Stockage JSON** :
    -   Les données sont aussi sauvegardées dans `data/data.json` en plus de la base de données. Ce fichier peut grossir rapidement et n'est pas sécurisé pour un usage en production.
-   **Changement de thème** :
    -   Le changement de thème ne prend pas en compte les préférences utilisateur ou le fuseau horaire serveur, uniquement l'heure locale du navigateur.
-   **Sécurité** :
    -   Pas d'authentification, pas de gestion avancée des droits.
