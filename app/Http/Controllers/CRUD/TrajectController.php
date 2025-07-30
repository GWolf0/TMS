<?php

namespace App\Http\Controllers\CRUD;

use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\TrajectRequest;
use App\Http\Resources\TrajectResource;
use App\Models\Traject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;


// CRUD only
class TrajectController extends Controller
{
    // show
    public function show(Request $req, string $id): JsonResponse{
        $model = Traject::findOrFail($id);
        Gate::authorize('view', $model);
        return response()->json(new TrajectResource($model));
    }

    // index
    public function index(Request $req): JsonResponse{
        Gate::authorize('viewAny', Traject::class);
        $models = QueryHelper::searchFiltered(Traject::query(), $req->query());
        return response()->json(TrajectResource::collection($models));
    }

    // store
    public function store(TrajectRequest $req): JsonResponse{
        Gate::authorize('create', Traject::class);
        $model = Traject::create($req->validated());
        return response()->json($model);
    }

    // update
    public function update(TrajectRequest $req, string $id): JsonResponse{
        $model = Traject::findOrFail($id);
        Gate::authorize('update', $model);
        $model->update($req->validated());
        return response()->json($model);
    }

    // delete
    public function destroy(Request $req, string $id): JsonResponse{
        $model = Traject::findOrFail($id);
        Gate::authorize('delete', $model);
        $model->delete();
        return response()->json(["message" => "Model deleted successfully"]);
    }

}
