<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class UserController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function home(): Response{
        return $this->render('user/home.html.twig', [
            'controller_name' => 'UserController',
        ]);
    }
    #[Route('/user', name: 'app_user')]
    public function index(): Response
    {
        return $this->render('user/index.html.twig', [
            'controller_name' => 'UserController',
        ]);
    }

    #[Route('/submit', name: 'user_submit', methods: ['POST'])]
    public function submit(Request $request, EntityManagerInterface $em): Response
    {
        $data = $request->request->all();
        $errors = [];



    if (!$this->isCsrfTokenValid('user_form', $data['_token'] ?? '')) {
        $errors['csrf'] = "Le jeton CSRF est invalide.";
    }

    
    if (empty($data['fullName']) || strlen($data['fullName']) < 3 || strlen($data['fullName']) > 50) {
        $errors['fullName'] = "Le nom complet est invalide (3 à 50 caractères).";
    }
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = "L'email est invalide.";
    }
    if (!preg_match('/^[0-9]{9,12}$/', $data['phone'])) {
        $errors['phone'] = "Le numéro de téléphone est invalide (9 à 12 chiffres)";
    }
    if (empty($data['dob'])) {
        $errors['dob'] = "La date de naissance est obligatoire.";
    }
    if (empty($data['address'])) {
        $errors['address'] = "L'adresse est obligatoire.";
    }

    if ($errors) {
        return $this->render('user/index.html.twig', [
            'errors' => $errors,
            'data' => $data
        ]);
    }

    $user = new User();
    $user->setFullName($data['fullName']);
    $user->setEmail($data['email']);
    $user->setPhone($data['phone']);
    $user->setDob(new \DateTime($data['dob']));
    $user->setAddress($data['address']);
    $cleanData = [
        'fullName' => $data['fullName'],
        'email'    => $data['email'],
        'phone'    => $data['phone'],
        'dob'      => $data['dob'],
        'address'  => $data['address'],
    ];
    $this->sauvegardeJson($cleanData);

    $em->persist($user);
    $em->flush();

    return $this->render('user/success.html.twig', ['user' => $user]);
    }


    public function sauvegardeJson($donnees){

    $jsonPath = $this->getParameter('kernel.project_dir') . '/data/data.json';
    $jsonContent = [];
    if (file_exists($jsonPath)) {
        $jsonContent = json_decode(file_get_contents($jsonPath), true) ?? [];
    }
    $jsonContent[] = $donnees;
    file_put_contents($jsonPath, json_encode($jsonContent, JSON_PRETTY_PRINT));
    }
}
