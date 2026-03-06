<?php

namespace App\Providers;

use App\Models\Outil;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\ServiceProvider;
use Rebing\GraphQL\Support\Facades\GraphQL;

class GraphQLServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->loadGraphQLClasses();
    }

    /**
     * Charge automatiquement types + queries + mutations depuis les dossiers
     */
    protected function loadGraphQLClasses(): void
    {
        $workDirectory = 'GraphQL';
        $directories = ['Type', 'Query', 'Mutation']; // ← ajouté Mutation si besoin

        foreach ($directories as $directory) {
            $cacheKey = "graphql.{$directory}.classes";

            // En prod → cache 24h (ou forever selon tes besoins)
            $classes = Cache::remember(
                $cacheKey,
                now()->addHours(24),
                fn () => $this->getAllClassesOf($workDirectory, $directory)
            );
            $classes = $this->getAllClassesOf($workDirectory, $directory);
            if (empty($classes)) {
                continue;
            }

            $method = "register{$directory}s";

            if (method_exists($this, $method)) {
                $this->$method($classes);
            }
        }
    }

    protected function registerTypes(array $classes): void
    {
        GraphQL::addTypes($classes);
    }

    protected function registerQuerys(array $classes): void
    {
        $queries = $this->buildSchemaEntries($classes);

        // On MERGE avec ce qui existe déjà (important !)
        $existingQueries = config('graphql.schemas.default.query', []);
        config([
            'graphql.schemas.default.query' => array_merge($existingQueries, $queries),
        ]);
    }

    protected function registerMutations(array $classes): void
    {
        $mutations = $this->buildSchemaEntries($classes);

        $existingMutations = config('graphql.schemas.default.mutation', []);
        config([
            'graphql.schemas.default.mutation' => array_merge($existingMutations, $mutations),
        ]);
    }

    /**
     * Construit le tableau [name => ClassName] pour queries/mutations
     */
    protected function buildSchemaEntries(array $classes): array
    {
        $entries = [];

        foreach ($classes as $class) {
            $instance = new $class();
            $name = $instance->attributes['name'] ?? class_basename($class);

            $entries[$name] = $class;
        }

        return $entries;
    }

    /**
     * Récupère toutes les classes PHP dans un dossier
     */
    protected function getAllClassesOf(string $workDirectory, string $directory): array
    {
        $path = app_path("{$workDirectory}/{$directory}");

        if (!is_dir($path)) {
            return [];
        }

        $classes = [];

        foreach (glob("{$path}/*.php") as $file) {
            $className = 'App\\GraphQL\\' . $directory . '\\' . basename($file, '.php');

            if (class_exists($className)) {
                $classes[] = $className;
            }
        }

        return $classes;
    }
}