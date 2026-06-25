<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * POST /api/users — create a user.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:1', 'max:100'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:100'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'email_verified' => false,
        ]);

        return response()->json([
            'success' => true,
            'data' => $user->toApiArray(),
            'message' => 'User created successfully',
        ], 201);
    }

    /**
     * GET /api/users/{id} — fetch a user (auth:sanctum).
     */
    public function show(string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $user->toApiArray(),
        ]);
    }
}
