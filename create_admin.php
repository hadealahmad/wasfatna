<?php
$user = \App\Models\User::firstOrCreate(
    ['email' => 'hade.alahmad1@gmail.com'],
    [
        'name' => 'Admin',
        'password' => bcrypt('password'),
        'role' => 'admin',
        'email_verified_at' => now(),
        'display_name' => 'Admin'
    ]
);
$user->role = 'admin';
$user->save();
echo 'Admin user set: ' . $user->email . PHP_EOL;
