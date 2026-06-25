<?php

namespace App\Providers;

use Dedoc\Scramble\Scramble;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Serve the OpenAPI docs UI at /reference (Traefik routes /reference -> api:5000),
        // replacing the previous Scalar mount.
        Scramble::registerUiRoute(path: 'reference');
        Scramble::registerJsonSpecificationRoute(path: 'reference/openapi.json');

        // Allow viewing the API docs in all environments (this is a starter template).
        Gate::define('viewApiDocs', fn ($user = null) => true);
    }
}
