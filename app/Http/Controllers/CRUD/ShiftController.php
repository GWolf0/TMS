<?php

namespace App\Http\Controllers\CRUD;

use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\ShiftRequest;
use App\Http\Resources\ShiftResource;
use App\Models\Shift;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;


// CRUD only
class ShiftController extends Controller
{
    // show
    public function show(Request $req, string $id): JsonResponse{
        $model = Shift::findOrFail($id);
        Gate::authorize('view', $model);
        return response()->json(new ShiftResource($model));
    }

    // index
    public function index(Request $req): JsonResponse{
        Gate::authorize('viewAny', Shift::class);
        $models = QueryHelper::searchFiltered(Shift::query(), $req->query());
        return response()->json(ShiftResource::collection($models));
    }

    // store
    public function store(ShiftRequest $req): JsonResponse{
        Gate::authorize('create', Shift::class);
        $model = Shift::create($req->validated());
        return response()->json($model);
    }

    // update
    public function update(ShiftRequest $req, string $id): JsonResponse{
        $model = Shift::findOrFail($id);
        Gate::authorize('update', $model);
        $model->update($req->validated());
        return response()->json($model);
    }

    // delete
    public function destroy(Request $req, string $id): JsonResponse{
        $model = Shift::findOrFail($id);
        Gate::authorize('delete', $model);
        $model->delete();
        return response()->json(["message" => "Model deleted successfully"]);
    }

}
