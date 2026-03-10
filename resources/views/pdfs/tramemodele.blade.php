<table class="table-bordered border-dark">
    @php
	   $columns = collect($columns)->map(
           function ($u)
           {
                $u['column_excel'] = \Illuminate\Support\Str::upper($u['column_excel']);
                return $u;
           })->toArray();
    @endphp
    <thead>
        <tr>
            @foreach($columns as $column)
                <th><strong>{{$column['column_excel']}}</strong></th>
            @endforeach
        </tr>
    </thead>
</table>
