<?php
header('Content-Type: text/plain');

echo "Debug Info:\n";
echo "PHP User: " . exec('whoami') . "\n";
echo "PHP Group: " . exec('id -gn') . "\n";

$targetFileRel = 'storage/recipes/c0068169-5080-4c06-8325-a5f1cb6193fe.webp'; // Relative to public
$publicStorage = 'storage'; // In public dir

echo "Checking: $targetFileRel\n";

if (file_exists($targetFileRel)) {
    echo "File exists via relative path.\n";
} else {
    echo "File NOT found via relative path.\n";
}

$realPath = realpath($targetFileRel);
echo "Real Path: " . ($realPath ? $realPath : "False") . "\n";

if ($realPath) {
    echo "Permissions: " . substr(sprintf('%o', fileperms($realPath)), -4) . "\n";
    echo "Owner ID: " . fileowner($realPath) . "\n";
    echo "Group ID: " . filegroup($realPath) . "\n";
}

// Check symlink
if (is_link($publicStorage)) {
    echo "'storage' is a symlink.\n";
    echo "Target: " . readlink($publicStorage) . "\n";
} elseif (is_dir($publicStorage)) {
    echo "'storage' is a DIRECTORY (Not a symlink!). This is likely the problem.\n";
} else {
    echo "'storage' not found in public.\n";
}

// Check storage dir permissions
$storageAppPublic = '../storage/app/public';
echo "Checking storage/app/public permissions:\n";
if (file_exists($storageAppPublic)) {
    echo "Path: " . realpath($storageAppPublic) . "\n";
    echo "Permissions: " . substr(sprintf('%o', fileperms($storageAppPublic)), -4) . "\n";
} else {
    echo "../storage/app/public not found.\n";
}

// OS Check (SELinux?)
echo "SELinux status: " . exec('sestatus') . "\n";
