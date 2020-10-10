<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Acme\Helpers\MainHelper;

class MainController extends Controller
{
    public function getDataTableView ()
    {
        $tables = MainHelper::getDataTables();
        $filters = MainHelper::getDataFilters();
        $charts = MainHelper::getDataCharts();

        return view('data.index', compact('tables', 'filters', 'charts'));
    }
}
