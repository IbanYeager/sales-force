<?php

/**
 * Laravel Root Proxy for Shared Hosting (Hostinger / cPanel)
 */

define('LARAVEL_START', microtime(true));

// Forward to public index.php
require __DIR__ . '/public/index.php';
