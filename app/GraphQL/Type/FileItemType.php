<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;

class FileItemType extends RefactGraphQLType
{
    protected function resolveFields(): array
    {
        return [
            'id'                                 => ['type' => Type::int()],

            'identify'                           => ['type' => Type::string()],
            'url'                                => ['type' => Type::string()],

            'name'                               => ['type' => Type::string()],
            'origine'                            => ['type' => Type::string()],

            // 'ordre_transit_id'                   => ['type' => Type::int()],
            // 'ordre_transit'                      => ['type' => GraphQL::type('OrdreTransitType')],

            // 'ordre_transit_document_id'          => ['type' => Type::int()],
            // 'ordre_transit_document'             => ['type' => GraphQL::type('OrdreTransitDocumentType')],

            // 'ordre_transit_bl_id'                => ['type' => Type::int()],
            // 'ordre_transit_bl'                   => ['type' => GraphQL::type('OrdreTransitBlType')],

            'created_at'                         => ['type' => Type::string()],
            'created_at_fr'                      => ['type' => Type::string()],
            'updated_at'                         => ['type' => Type::string()],
            'updated_at_fr'                      => ['type' => Type::string()],
        ];
    }

    public function resolveOrigineField($root, $args)
    {
        //dd($root);
        $origine = $root->origine;
        if (isset($root->dossier_id))
        {
            if (isset($root->dossier_manifeste_id))
            {
                $origine = 'manifeste';
            }
            else if (isset($root->dossier_debour_id))
            {
                $origine = 'débours';
            }
        }
        else if (isset($root->ordre_transit_id))
        {
            if (isset($root->ordre_transit_bl_id))
            {
                $origine = 'Connaissement';
            }
            else if (isset($root->ordre_transit_document_id))
            {
                $origine = 'Documents';
            }
            else if (isset($root->ordre_transit_ff_id))
            {
                $origine = 'Facture Fournisseur';
            }
            else if (isset($root->ordre_transit_fft_id))
            {
                $origine = 'Facture Frêt';
            }
            else if (isset($root->ordre_transit_asre_id))
            {
                $origine = 'Assurance';
            }
            else if (isset($root->ordre_transit_dpi_id))
            {
                $origine = 'DPI';
            }
            else if (isset($root->ordre_transit_bsc_id))
            {
                $origine = 'BSC';
            }
        }
        return $origine;
    }
}
