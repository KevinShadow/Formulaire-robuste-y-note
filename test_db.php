<?php
$mysqli = new mysqli('mysql', 'root', 'root', 'form_db');

if ($mysqli->connect_error) {
    echo 'Erreur de connexion : ' . $mysqli->connect_error . PHP_EOL;
    exit(1);
}
echo "Connexion MySQL réussie !\n";
$mysqli->close();
