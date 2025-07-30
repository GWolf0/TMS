<?php

namespace App\Http\Controllers\CRUD;

use App\Http\Controllers\Controller;
use App\Http\Requests\TMSSystemRequest;
use App\Http\Resources\TMSSystemResource;
use App\Models\TMSSystem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;


// CRUD only (!! this model must have one instance !!)
class TMSSystemController extends Controller
{
    // find first (sole) instance
    public function show(Request $req): JsonResponse{
        $model = TMSSystem::getInstance();
        Gate::authorize('view', $model);
        return response()->json(new TMSSystemResource($model));
    }

    // no index

    // no store (instance created automatically if not already exists)

    // update (sole instance)
    public function update(TMSSystemRequest $req): JsonResponse{
        $model = TMSSystem::getInstance();
        Gate::authorize('update', $model);
        $model->update($req->validated());
        TMSSystem::invalidateInstance();
        return response()->json($model);
    }

    // no delete

}
