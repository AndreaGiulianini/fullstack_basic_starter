<?php

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Uniform JSON error envelope for all /api/* responses
        // (mirrors the previous Node API: { success:false, error:{...} }).
        $exceptions->render(function (Throwable $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            $statusCode = match (true) {
                $e instanceof ValidationException => 422,
                $e instanceof AuthenticationException => 401,
                $e instanceof AuthorizationException => 403,
                $e instanceof ModelNotFoundException, $e instanceof NotFoundHttpException => 404,
                $e instanceof HttpExceptionInterface => $e->getStatusCode(),
                default => 500,
            };

            $message = $e instanceof ValidationException
                ? 'Validation failed'
                : ($statusCode === 500 && ! config('app.debug') ? 'Internal server error' : $e->getMessage());

            $error = [
                'message' => $message,
                'code' => class_basename($e),
                'statusCode' => $statusCode,
                'timestamp' => now()->toIso8601String(),
                'path' => '/'.ltrim($request->path(), '/'),
            ];

            if ($e instanceof ValidationException) {
                $error['details'] = collect($e->errors())
                    ->flatMap(fn (array $messages, string $field) => array_map(
                        fn (string $m) => ['field' => $field, 'message' => $m, 'code' => 'invalid'],
                        $messages,
                    ))
                    ->values()
                    ->all();
            }

            return response()->json(['success' => false, 'error' => $error], $statusCode);
        });
    })->create();
