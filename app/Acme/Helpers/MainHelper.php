<?php

namespace App\Acme\Helpers;

use App\EmploymentContracts;

class MainHelper
{
    public static function getDataFilters()
    {
        $options = [
            [
                "id" => 'genre',
                "text" => 'Genre',
            ], [
                "id" => 'residence',
                "text" => 'Residence',
            ], [
                "id" => 'sector',
                "text" => 'Sector',
            ], [
                "id" => 'age',
                "text" => 'Age',
            ]
        ];

        $filters = collect([
            'id' => 'data-filters',
            'filters' => [
                [
                    'id' => 'option',
                    'class' => "col col-sm-2",
                    'type' => 'select',
                    'title' => 'Option',
                    'placeholder' => '',
                    'options' => $options,
                    'allowClear' => true
                ]
            ]
        ]);

        return $filters;
    }

    public static function getDataCharts()
    {
        $genre = EmploymentContracts::all()->unique('genre')->count();
        $residence = EmploymentContracts::all()->unique('residence')->count();
        $sector = EmploymentContracts::all()->unique('sector')->count();
        $age = EmploymentContracts::all()->unique('age')->count();

        $charts = [
            [
                'title' => "Net job creation chart",
                'id' => 'data-chart',
                'apiUrl' => '/chart/data-chart',
                'class' => 'data-chart',
                'bottomLegend' => true,
                'additionalData' =>[
                    'genre' => $genre,
                    'residence' => $residence,
                    'sector' => $sector,
                    'age' => $age
                ],
                'yAxes' => [
                    [
                        'title' => '',
                        'name' => '',
                        'type' => 'spline',
                        'yAxis' => 0,
                        'suffix' => ''
                    ],
                ],
                'yAxesTemplate' => [
                    'title' => '',
                    'name' => '',
                    'type' => 'spline',
                    'yAxis' => 0,
                    'suffix' => ''
                ],
                'xAxis' => [
                    'title' => 'Year',
                    'name' => 'year'
                ]
            ]
        ];

        $charts = collect($charts);

        return $charts;
    }

    public static function getDataTables()
    {
        $tables = [
            [
                'id' => 'jobs-active-table',
                'apiUrl' => '/table/data-table',
                'default_order' => 'desc',
                'default_sort' => 'year',
                'class' => 'col-xl-12',
                'pageSize' => 10,
                'columns' => [
                    [
                        'title' => 'Year',
                        'field' => 'year',
                        'sortable' => 1,
                        'align' => 'center',
                    ],
                    [
                        'title' => 'Genre',
                        'field' => 'genre',
                        'sortable' => 1,
                        'align' => 'center',
                    ],
                    [
                        'title' => 'Residence',
                        'field' => 'residence',
                        'sortable' => 0
                    ],
                    [
                        'title' => 'Sector',
                        'field' => 'sector',
                        'sortable' => 0
                    ],
                    [
                        'title' => 'Recrutements',
                        'field' => 'recrutements',
                        'sortable' => 0
                    ],
                    [
                        'title' => 'Age',
                        'field' => 'age',
                        'sortable' => 0,
                        'align' => 'center',
                    ],
                    [
                        'title' => 'End contracts',
                        'field' => 'end_contracts',
                        'sortable' => 0,
                        'align' => 'center',
                    ],
                    [
                        'title' => 'Net job creation',
                        'field' => 'net_job_creation',
                        'sortable' => 1
                    ],
                ]
            ]
        ];

        $tables = collect($tables);

        return $tables;
    }
}
