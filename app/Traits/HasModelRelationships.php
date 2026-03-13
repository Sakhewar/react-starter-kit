<?php

namespace App\Traits;

use App\Models\{
    Client,
    Contact,
    Depot,
    FamilleProduit,
    FileItem,
    Fournisseur,
    Marque,
    Module,
    ModeLink,
    ModePaiement,
    ModalitePaiement,
    Notif,
    NotifPermUser,
    Page,
    Pays,
    PointVente,
    PrixVente,
    Seuil,
    TypeClient,
    TypeDepot,
    TypeFournisseur,
    User};
use Illuminate\Database\Eloquent\Relations\{BelongsTo};
use Spatie\Permission\Models\{Permission};

trait HasModelRelationships
{
    public function permissions()
    {
        return $this->hasMany(Permission::class)->orderBy('type_permission_id');
    }
    public function notif()
    {
        return $this->belongsTo(Notif::class);
    }
    public function pay()
    {
        return $this->belongsTo(Pays::class);
    }

    public function notifpermusers()
    {
        return $this->hasMany(NotifPermUser::class);
    }

    public function notif_perm_users()
    {
        return $this->hasMany(NotifPermUser::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function modules()
    {
        return $this->hasMany(Module::class)->orderBy('order');
    }

    public function mode_link()
    {
        return $this->belongsTo(ModeLink::class);
    }

    public function pages()
    {
        return $this->hasMany(Page::class)->orderBy('order');
    }

    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }
    public function created_at_user()
    {
        return $this->belongsTo(User::class);
    }

    public function updated_at_user()
    {
        return $this->belongsTo(User::class);
    }

    public function fournisseur(): BelongsTo
    {
        return $this->belongsTo(Fournisseur::class);
    }

    public function fournisseurs()
    {
        return $this->belongsToMany(Fournisseur::class);
    }
    
    public function type_client()
    {
        return $this->belongsTo(TypeClient::class);
    }

    public function type_depot()
    {
        return $this->belongsTo(TypeDepot::class);
    }

    public function famille_produit()
    {
        return $this->belongsTo(FamilleProduit::class);
    }

    public function sous_famille_produit()
    {
        return $this->belongsTo(FamilleProduit::class);
    }

    public function prix_ventes()
    {
        return $this->hasMany(PrixVente::class)->orderBy('id');
    }

    public function seuils()
    {
        return $this->hasMany(Seuil::class)->orderBy('id');
    }

    public function marque()
    {
        return $this->belongsTo(Marque::class);
    }

    public function point_vente()
    {
        return $this->belongsTo(PointVente::class);
    }

    public function depot()
    {
        return $this->belongsTo(Depot::class);
    }

    public function type_fournisseur()
    {
        return $this->belongsTo(TypeFournisseur::class);
    }
    public function clients()
    {
        return $this->belongsToMany(Client::class);
    }
    public function users()
    {
        return $this->hasMany(User::class);
    }
    public function modalite_paiement()
    {
        return $this->belongsTo(ModalitePaiement::class);
    }
    public function mode_paiement(): BelongsTo
    {
        return $this->belongsTo(ModePaiement::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function pays(): BelongsTo
    {
        return $this->belongsTo(Pays::class);
    }
    public function files() // ordretransits
    {
        return $this->hasMany(FileItem::class)->orderBy('id', 'desc');
    }

    /**
     * --------------------
     * GETTER
     * -----------------
     */


    public function getNbClientsAttribute()
    {
        return $this->clients()->get()->count();
    }

    // public function getNomCompletAttribute()
    // {
    //     return trim("{$this->prenom} {$this->nom}");
    // }
}
