<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ListItem extends Pivot
{
    protected $table = 'list_items';

    public $incrementing = true;
}
