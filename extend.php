<?php

use ElChoco\Kobalt\ForumSettings;
use Flarum\Extend;

$defaults = json_decode(file_get_contents(__DIR__.'/settings.json'), true, flags: JSON_THROW_ON_ERROR);
$settings = new Extend\Settings();

foreach ($defaults as $name => $value) {
    $key = 'el-choco-kobalt.'.$name;
    $settings->default($key, $value);
}

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/studio.less')
        ->css(__DIR__.'/less/forum.less')
        ->content(ForumSettings::class),
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/less/studio.less')
        ->css(__DIR__.'/less/admin.less'),
    new Extend\Locales(__DIR__.'/locale'),
    $settings,
];
