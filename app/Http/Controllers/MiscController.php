<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class MiscController extends Controller{

    // get foreign ids labels
    public function getFKLabels(Request $req, string $table_name): JsonResponse{
        $labelColumn = config("consts.tables_to_labels.$table_name");
        // Log::debug("hit fk labels $table_name , $labelColumn");

        if(!$labelColumn || !Schema::hasTable($table_name) || !Schema::hasColumn($table_name, 'id') || !Schema::hasColumn($table_name, $labelColumn)) {
            return response()->json(['error' => 'Invalid table or label column'], 400);
        }

        $query = DB::table($table_name)->select(['id', "$labelColumn as label"]);

        // Optional: simple search
        if ($search = $req->input('q')) {
            $query->where($labelColumn, 'like', '%' . $search . '%');
        }

        // Optional: customizable page size
        $perPage = $req->input('per_page', 15);

        return response()->json($query->paginate($perPage));
    }
        
    // get constants
    public function getConsts(Request $req): JsonResponse{
        return response()->json(config('consts'));
    }

}
