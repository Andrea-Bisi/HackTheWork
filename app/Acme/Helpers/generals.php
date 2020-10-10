<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use jeremykenedy\LaravelRoles\Models\Role;
use Carbon\Carbon;

/**
 * Returns the active class if the path matches the current URL
 * @param array $path
 * @param string $active
 * @return string
 */
function set_active($path, $active = 'nav-active')
{
    if (is_array($path))
    {
        foreach ($path as $p)
        {
            if (Request::is($p))
            {
                return $active;
            }
        }

        return '';
    }

    return Request::is($path) ? $active : '';
}