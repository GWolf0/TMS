<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

// Allows only authenticated users with specified role(s)
class RoleMiddleware
{

    public function __construct(protected string $roles){}

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if(empty($request->user)) abort(401, "Unauthenticated request");

        $roles = explode(",", $this->$roles);

        if(!in_array($request->user->role, $roles)) abort(403, "Unauthorized request");

        return $next($request);
    }
}
