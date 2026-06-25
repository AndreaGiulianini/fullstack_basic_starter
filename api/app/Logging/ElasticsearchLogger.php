<?php

namespace App\Logging;

use Elastic\Elasticsearch\ClientBuilder;
use Monolog\Handler\ElasticsearchHandler;
use Monolog\Handler\WhatFailureGroupHandler;
use Monolog\Level;
use Monolog\Logger;

class ElasticsearchLogger
{
    /**
     * Create a Monolog logger that ships to Elasticsearch (index `api-logs`).
     * Wrapped in WhatFailureGroupHandler so an ES outage never breaks a request.
     *
     * @param  array<string, mixed>  $config
     */
    public function __invoke(array $config): Logger
    {
        $logger = new Logger('elasticsearch');

        $host = env('ELASTICSEARCH_HOST');
        $port = env('ELASTICSEARCH_PORT');

        if (! $host || ! $port) {
            return $logger; // ES not configured — no-op logger.
        }

        try {
            $client = ClientBuilder::create()
                ->setHosts(["http://{$host}:{$port}"])
                ->build();

            $handler = new ElasticsearchHandler(
                $client,
                ['index' => $config['index'] ?? 'api-logs', 'op_type' => 'index'],
                Level::fromName($config['level'] ?? 'info'),
            );

            // Swallow handler failures (ES warming up / unreachable) instead of throwing.
            $logger->pushHandler(new WhatFailureGroupHandler([$handler]));
        } catch (\Throwable) {
            // ES client could not be built — degrade to a no-op logger.
        }

        return $logger;
    }
}
