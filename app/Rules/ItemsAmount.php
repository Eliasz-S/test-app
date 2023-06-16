<?php

namespace App\Rules;

use App\Models\Goods;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ItemsAmount implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $itemsTotalAmount = Goods::sum('amount') + $value;

        if ($itemsTotalAmount > env('MAX_ITEMS_TOTAL', 10)) {
            $fail('Достигнут лимит товаров на складе');
        }
    }
}
