<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGoodsRequest;
use App\Http\Requests\UpdateGoodsRequest;
use App\Models\Goods;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GoodsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $goods = Goods::all();

        return $goods;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGoodsRequest $request)
    {
        $data = $request->validated();

        $goods = Goods::create([
            'name' => Str::ucfirst($data['name']),
            'amount' => $data['amount'],
        ]);

        if ($goods) {
            return response()->json(['message' => 'Новый товар успешно добавлен!']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGoodsRequest $request, string $id)
    {
        // общее количество всех остальных товаров
        $subTotal = Goods::whereNot('id', $id)->sum('amount');

        $data = $request->validated();

        // общее количество товаров, если добавить измененное количество текущего товара
        $total = $subTotal + $data['amount'];

        if ($total <= env('MAX_ITEMS_TOTAL', 10)) {
            $goods = Goods::findOrFail($id)->update(['amount' => $data['amount']]);

            if ($goods) {
                return response()->json(['message' => 'Количество товара изменено успешно']);
            }
        }

        return response()->json([
            'message' => 'Достигнут лимит товаров на складе'
        ], 422);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
