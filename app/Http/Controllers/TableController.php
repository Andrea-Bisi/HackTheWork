<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\EmploymentContracts;

class TableController extends Controller
{
    public function getDataTable(Request $request)
    {
        $params = $request->all();

        $data = EmploymentContracts::query($params);

        $total = $data->count();
        $data = $data->orderBy($request->get('sort', 'id'), $request->get('order', 'desc'))
            ->skip($request->get('offset', 0))
            ->take($request->get('limit', '20'))
            ->get();

        $response = [
            'total' => $total,
            'rows' => $data
        ];

        return new JsonResponse($response, 200);
    }
}
