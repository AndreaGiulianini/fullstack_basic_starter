<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class HealthcheckController extends Controller
{
    /**
     * GET /api/healthcheck/ping — verifies Valkey/Redis connectivity.
     */
    public function ping(): JsonResponse
    {
        // Touch the cache (Valkey) to verify connectivity, the same way the Node API did.
        Cache::put('test', 'ping', now()->addMinutes(5));
        Cache::get('test');

        return response()->json([
            'success' => true,
            'message' => 'pong',
        ]);
    }

    /**
     * POST /api/identity-count — echoes a non-negative integer amount.
     */
    public function identityCount(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'integer', 'min:0'],
        ]);

        return response()->json([
            'success' => true,
            'amount' => $validated['amount'],
        ]);
    }
}
