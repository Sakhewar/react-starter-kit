@extends('pdfs.layouts.layout-export')

@section('title', 'Liste des données')

@section('content')
    <table class="table table-bordered w-100" align="center">
        <tr class="tr" style="font-size: 1.2em;">
            @foreach($columns as $column)
                <th class="th"><strong>{{$column['column_excel']}}</strong></th>
            @endforeach
        </tr>
        <tbody>
            @for ($i = 0; $i < count($data); $i++)
                <tr class="tr" align="center">
                    
                    @foreach($columns as $column)
                        @php
                            $column['column_export'] = $column['column_export'] ?? $column['column_db'];
                            $texte = $data[$i][$column['column_export']] ?? null;
                            if (str_contains($column['column_export'], '_id') && isset($column['columnMatched']))
                            {
                                $column['column_export'] = str_replace('_id', '', $column['column_export']);
                                $texte = $data[$i][$column['column_export']][$column['columnMatched']];
                            }
                        @endphp
                        <td class="td">{{ ucfirst( $texte) }}</td>
                    @endforeach
                </tr>
            @endfor
        </tbody> 
    </table>
@endsection