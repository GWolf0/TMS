<?php

namespace App\Http\Controllers\CRUD;

use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\OrganizationRequest;
use App\Http\Resources\OrganizationResource;
use App\Models\Organization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

// CRUD only
class OrganizationController extends Controller
{
    // show
    public function show(Request $req, string $id): JsonResponse{
        $model = Organization::findOrFail($id);
        Gate::authorize('view', $model);
        return response()->json(new OrganizationResource($model));
    }

    // index
    public function index(Request $req): JsonResponse{
        Gate::authorize('viewAny', Organization::class);
        $models = QueryHelper::searchFiltered(Organization::query(), $req->query());
        return response()->json(OrganizationResource::collection($models));
    }

    // store
    public function store(OrganizationRequest $req): JsonResponse{
        Gate::authorize('create', Organization::class);
        $model = Organization::create($req->validated());
        return response()->json($model);
    }

    // update
    public function update(OrganizationRequest $req, string $id): JsonResponse{
        $model = Organization::findOrFail($id);
        Gate::authorize('update', $model);
        $model->update($req->validated());
        return response()->json($model);
    }

    // delete
    public function destroy(Request $req, string $id): JsonResponse{
        $model = Organization::findOrFail($id);
        Gate::authorize('delete', $model);
        $model->delete();
        return response()->json(["message" => "Model deleted successfully"]);
    }

}
