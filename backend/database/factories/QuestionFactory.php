<?php

namespace Database\Factories;

use App\Models\Municipi;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Question>
 */
class QuestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $ids_municipis = Municipi::pluck('id');
        return [
            'content' => fake()->sentence . ' ?',
            'answer1' => $answer1 = fake()->sentence,
            'answer2' => $answer2 = fake()->sentence,
            'answer3' => $answer3 = fake()->sentence,
            'answer4' => $answer4 = fake()->sentence,
            'correct_answer' => fake()->randomElement([$answer1, $answer2, $answer3, $answer4]),
            'municipi_id' => fake()->randomElement($ids_municipis),
        ];
    }
}
