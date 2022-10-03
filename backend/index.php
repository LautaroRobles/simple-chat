<?php

// Require composer autoloader
require __DIR__ . '/vendor/autoload.php';

// Create Router instance
$router = new \Bramus\Router\Router();

// Define routes
// ...

// Run it!
$router->run();

$router->get('/', function () {
  echo 'index';
});
$router->get('/api', function () {
  echo 'asd';
});
