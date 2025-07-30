<?php

namespace App\Http\Controllers\CRUD;

use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\VehicleRequest;
use App\Http\Resources\VehicleResource;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;


// CRUD only
class VehicleController extends Controller
{
    // show
    public function show(Request $req, string $id): JsonResponse{
        $model = Vehicle::findOrFail($id);
        Gate::authorize('view', $model);
        return response()->json(new VehicleResource($model));
    }

    // index
    public function index(Request $req): JsonResponse{
        Gate::authorize('viewAny', Vehicle::class);
        $models = QueryHelper::searchFiltered(Vehicle::query(), $req->query());
        return response()->json(VehicleResource::collection($models));
    }

    // store
    public function store(VehicleRequest $req): JsonResponse{
        Gate::authorize('create', Vehicle::class);
        $model = Vehicle::create($req->validated());
        return response()->json($model);
    }

    // update
    public function update(VehicleRequest $req, string $id): JsonResponse{
        $model = Vehicle::findOrFail($id);
        Gate::authorize('update', $model);
        $model->update($req->validated());
        return response()->json($model);
    }

    // delete
    public function destroy(Request $req, string $id): JsonResponse{
        $model = Vehicle::findOrFail($id);
        Gate::authorize('delete', $model);
        $model->delete();
        return response()->json(["message" => "Model deleted successfully"]);
    }

}
