<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Comarca;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Municipi>
 */
class MunicipiFactory extends Factory
{

    protected $model = \App\Models\Municipi::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $ids_comarques = Comarca::pluck('id');
        return [
            'name' => fake()->unique()->name,
            'latitude' => fake()->latitude,
            'longitude' => fake()->longitude,
            'comarca_id' => fake()->randomElement($ids_comarques)
        ];
    }
}
