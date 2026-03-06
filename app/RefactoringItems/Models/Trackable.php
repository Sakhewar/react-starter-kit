<?php

namespace App\RefactoringItems\Models;

use Illuminate\Support\Facades\Schema;
use App\RefactoringItems\Events\{TrackCreateModelEvent, TrackDeleteModelEvent, TrackUpdateModelEvent};
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait Trackable
{

    protected function trackEvents(): array
    {
        return [
            'created' => TrackCreateModelEvent::class,
            'updated' => TrackUpdateModelEvent::class,
            'deleted' => TrackDeleteModelEvent::class,
        ];
    }

    /**
     * Recupere l'utilisateur qui a creer le model
     *
     * @return BelongsTo
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Recupere l'utilisateur qui a mit a le model
     *
     * @return BelongsTo
     */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Recupere l'utilisateur qui a supprimer le model
     *
     * @return BelongsTo
     */
    public function deletedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }

    /**
     * Verifie si les champs created_by && updated_by && deleted_by
     * sont creer
     *
     * @return boolean
     */
    public function hasTracingFields(): bool
    {
        return Schema::hasColumn($this->getTable(), 'created_by') &&
            Schema::hasColumn($this->getTable(), 'updated_by') &&
            Schema::hasColumn($this->getTable(), 'deleted_by');
    }
}
