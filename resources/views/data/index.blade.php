@extends('layouts.app')

@section('content')
    <data-table
        :tables="{{ $tables }}"
        :filters="{{ $filters }}"
        :charts="{{ $charts }}">
    </data-table>
@endsection
