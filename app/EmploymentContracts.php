<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EmploymentContracts extends Model
{
    protected $table = 'employment_contracts';
    protected $primaryKey = 'id';
    public $timestamps = false;
}
