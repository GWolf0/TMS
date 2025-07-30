<?php

namespace App\Http\Controllers\CRUD;

use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;


// CRUD only
class ReservationController extends Controller
{
    // show
    public function show(Request $req, string $id): JsonResponse{
        $model = Reservation::findOrFail($id);
        Gate::authorize('view', $model);
        return response()->json(new ReservationResource($model));
    }

    // index
    public function index(Request $req): JsonResponse{
        Gate::authorize('viewAny', Reservation::class);
        $models = QueryHelper::searchFiltered(Reservation::query(), $req->query());
        return response()->json(ReservationResource::collection($models));
    }

    // store
    public function store(ReservationRequest $req): JsonResponse{
        Gate::authorize('create', Reservation::class);
        $model = Reservation::create($req->validated());
        return response()->json($model);
    }

    // update
    public function update(ReservationRequest $req, string $id): JsonResponse{
        $model = Reservation::findOrFail($id);
        Gate::authorize('update', $model);
        $model->update($req->validated());
        return response()->json($model);
    }

    // delete
    public function destroy(Request $req, string $id): JsonResponse{
        $model = Reservation::findOrFail($id);
        Gate::authorize('delete', $model);
        $model->delete();
        return response()->json(["message" => "Model deleted successfully"]);
    }

}
