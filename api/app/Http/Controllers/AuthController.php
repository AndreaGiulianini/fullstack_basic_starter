<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    private const TOKEN_TTL_DAYS = 7;

    /**
     * POST /api/auth/sign-up/email
     */
    public function signUpEmail(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:1', 'max:100'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:100'],
            'callbackURL' => ['sometimes', 'nullable', 'url'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'email_verified' => false,
        ]);

        return response()->json($this->sessionPayload($user), 200);
    }

    /**
     * POST /api/auth/sign-in/email
     */
    public function signInEmail(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'rememberMe' => ['sometimes', 'boolean'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid email or password.'],
            ])->status(401);
        }

        return response()->json($this->sessionPayload($user), 200);
    }

    /**
     * GET /api/auth/get-session (auth:sanctum)
     */
    public function getSession(Request $request): JsonResponse
    {
        $user = $request->user();
        $token = $user->currentAccessToken();

        return response()->json([
            'user' => $user->toApiArray(),
            'session' => [
                'id' => (string) $token->id,
                'userId' => $user->id,
                'token' => null, // plaintext token is only returned at issue time
                'expiresAt' => optional($token->expires_at)->toIso8601String(),
            ],
        ]);
    }

    /**
     * POST /api/auth/sign-out (auth:sanctum)
     */
    public function signOut(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Signed out',
        ]);
    }

    /**
     * POST /api/auth/forgot-password
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'redirectTo' => ['sometimes', 'nullable', 'url'],
        ]);

        // Fire the reset link (mailer defaults to the 'log' driver). Respond generically
        // to avoid user enumeration — mirrors the previous API's success response.
        Password::sendResetLink($request->only('email'));

        return response()->json([
            'success' => true,
            'message' => 'If the email exists, a reset link has been sent.',
        ]);
    }

    /**
     * POST /api/auth/reset-password
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'max:100'],
        ]);

        $status = Password::reset($data, function (User $user, string $password) {
            $user->forceFill(['password' => $password])->save();
            $user->tokens()->delete();
        });

        if ($status !== Password::PasswordReset) {
            throw ValidationException::withMessages([
                'token' => ['Invalid or expired reset token.'],
            ])->status(401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Password has been reset.',
        ]);
    }

    /**
     * Build the { user, session } payload that the frontend contract expects.
     *
     * @return array<string, mixed>
     */
    private function sessionPayload(User $user): array
    {
        $expiresAt = now()->addDays(self::TOKEN_TTL_DAYS);
        $newToken = $user->createToken('api', ['*'], $expiresAt);

        return [
            'user' => $user->toApiArray(),
            'session' => [
                'id' => (string) $newToken->accessToken->id,
                'userId' => $user->id,
                'token' => $newToken->plainTextToken,
                'expiresAt' => $expiresAt->toIso8601String(),
            ],
        ];
    }
}
