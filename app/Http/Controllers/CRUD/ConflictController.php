<?php

namespace App\Http\Controllers\CRUD;

use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\ConflictRequest;
use App\Http\Resources\ConflictResource;
use App\Models\Conflict;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;


// CRUD only
class ConflictController extends Controller
{
    // show
    public function show(Request $req, string $id): JsonResponse{
        $model = Conflict::findOrFail($id);
        Gate::authorize('view', $model);
        return response()->json(new ConflictResource($model));
    }

    // index
    public function index(Request $req): JsonResponse{
        Gate::authorize('viewAny', Conflict::class);
        $models = QueryHelper::searchFiltered(Conflict::query(), $req->query());
        return response()->json(ConflictResource::collection($models));
    }

    // store
    public function store(ConflictRequest $req): JsonResponse{
        Gate::authorize('create', Conflict::class);
        $model = Conflict::create($req->validated());
        return response()->json($model);
    }

    // update
    public function update(ConflictRequest $req, string $id): JsonResponse{
        $model = Conflict::findOrFail($id);
        Gate::authorize('update', $model);
        $model->update($req->validated());
        return response()->json($model);
    }

    // delete
    public function destroy(Request $req, string $id): JsonResponse{
        $model = Conflict::findOrFail($id);
        Gate::authorize('delete', $model);
        $model->delete();
        return response()->json(["message" => "Model deleted successfully"]);
    }

}
