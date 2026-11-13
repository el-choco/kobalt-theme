<?php

namespace ElChoco\Kobalt;

use Flarum\Frontend\Document;
use Flarum\Settings\SettingsRepositoryInterface;

final class ForumSettings
{
    public function __construct(private readonly SettingsRepositoryInterface $settings)
    {
    }

    public function __invoke(Document $document): void
    {
        $defaults = json_decode(file_get_contents(__DIR__.'/../settings.json'), true, flags: JSON_THROW_ON_ERROR);
        $config = [];

        foreach ($defaults as $name => $default) {
            $value = $this->settings->get('el-choco-kobalt.'.$name, $default);
            $config[$name] = is_scalar($value) ? $value : $default;
        }

        $document->payload['kobaltSettings'] = $config;
    }
}
