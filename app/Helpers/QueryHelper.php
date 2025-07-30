<?php
namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class QueryHelper{
    /**
     * Filters and paginates results based on dynamic query parameters.
     *
     * @param Builder $builder      Eloquent query builder
     * @param string|array $queryParams Query string or associative array
     * @param array $with               For optional eager loading → ["organization:id,name"]
     * 
     * Supported filters:
     * - ?name=l_john        → LIKE 'john%'
     * - ?age=gt_25          → age > 25
     * - ?status[]=active&status[]=pending → WHERE status IN (...)
     * - ?status=active,pending   → WHERE status IN (...)
     * - ?s=created_at_desc   → Sort by created_at DESC
     */
    public static function searchFiltered(Builder $builder, string|array $queryParams, array $with = []): LengthAwarePaginator{
        if (is_string($queryParams)) {
            parse_str($queryParams, $queryParams);
        }

        $perPage = $queryParams['per_page'] ?? 15;
        $sortParam = $queryParams['s'] ?? null;
        $reserved = ['s', 'per_page', 'page'];

        if (!empty($with)) {
            $builder->with($with);
        }

        foreach ($queryParams as $field => $value) {
            if (in_array($field, $reserved)) continue;

            // Handle multi-value arrays (?status[]=active&status[]=pending)
            if (is_array($value)) {
                $builder->whereIn($field, $value);
                continue;
            }

            // Handle comma-separated (?status=active,pending)
            if (str_contains($value, ',')) {
                $builder->whereIn($field, explode(',', $value));
                continue;
            }

            // Handle prefixed filters like gt_, l_, etc.
            if (preg_match('/^(gt|gte|lt|lte|l)_(.+)$/', $value, $matches)) {
                [$_, $operator, $val] = $matches;
                match ($operator) {
                    'gt' => $builder->where($field, '>', $val),
                    'gte' => $builder->where($field, '>=', $val),
                    'lt' => $builder->where($field, '<', $val),
                    'lte' => $builder->where($field, '<=', $val),
                    'l' => $builder->where($field, 'like', $val . '%'),
                };
            } else {
                $builder->where($field, $value); // fallback to exact match
            }
        }

        // Sorting: ?s=field_asc or field_desc
        if ($sortParam) {
            foreach (explode(',', $sortParam) as $sortPart) {
                if (preg_match('/^(\w+)_(asc|desc)$/', $sortPart, $matches)) {
                    $builder->orderBy($matches[1], $matches[2]);
                }
            }
        }

        return $builder->paginate($perPage);
    }

}