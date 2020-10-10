<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\EmploymentContracts;

class ChartController extends Controller
{
    public function getDataChart(Request $request)
    {
        $params = $request->all();
        $data = EmploymentContracts::orderBy('year', 'asc')->get()->groupBy('year');
        /*
        if(isset($params['option']) && !empty($params['option'])){
            $data = EmploymentContracts::orderBy('year', 'asc')->get()->groupBy('year');
        }else{
            $data = EmploymentContracts::orderBy('year', 'asc')->get();
        }
        */
        $yAxis = [];
        $xAxis = [];
        $yAxisData = [];
        $data->each(function($entris, $year) use(&$yAxisData, &$xAxis, $params){
            $xAxis[] = $year;
            if(isset($params['option']) && !empty($params['option'])){
                $entris->groupBy($params['option'])->each(function($entris, $line)use(&$yAxisData, $year){
                    $yAxisData[$line][] = [$year, $entris->sum('net_job_creation')];
                });
            }else{
                $yAxisData['Year distribution'][] = [$year, $entris->sum('net_job_creation')];
            }
        });
        foreach ($yAxisData as $key => $axeData) {
            $tempAxe = [
                'title' => $key,
                'data' => $axeData,
                'axis' => 0,
                'marker' => true,
            ];
            array_push($yAxis, $tempAxe);
        }
        
        $chart = [
            'xAxis' => $xAxis,
            'yAxes' => $yAxis,
        ];
    
        $response = [
            'rows' => $chart
        ];
    
        return $response;
    }
}
