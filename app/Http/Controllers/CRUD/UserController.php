<?php

namespace App\Http\Controllers\CRUD;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

use App\Helpers\QueryHelper;
use Illuminate\Support\Facades\Log;

// CRUD only
class UserController extends Controller
{
    // show
    public function show(Request $req, string $id): JsonResponse{
        $model = User::with(User::$WITH)->findOrFail($id);
        Gate::authorize('view', $model);
        return response()->json(new UserResource($model));
    }

    // index
    public function index(Request $req): JsonResponse{
        Gate::authorize('viewAny', User::class);
        $models = QueryHelper::searchFiltered(User::query(), $req->query(), User::$WITH);
        return response()->json(UserResource::collection($models));
    }

    // store
    public function store(UserRequest $req): JsonResponse{
        Log::debug("stroe");
        Gate::authorize('create', User::class);
        $model = User::create($req->validated());
        return response()->json($model);
    }

    // update
    public function update(UserRequest $req, string $id): JsonResponse{
        Log::debug("!!");
        $model = User::findOrFail($id);
        Gate::authorize('update', $model);
        $model->update($req->validated());
        return response()->json($model);
    }

    // delete
    public function destroy(Request $req, string $id): JsonResponse{
        $model = User::findOrFail($id);
        Gate::authorize('delete', $model);
        $model->delete();
        return response()->json(["message" => "Model deleted successfully"]);
    }

}
