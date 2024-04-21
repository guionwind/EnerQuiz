<?php

use App\Models\Question;

it('can create a question and return it properly', function () {
    $question = Question::factory()->create([
        'content' => "Quina és la font d'energia amb major consum a Catalunya?",
        'answer1' => "Gas natural",
        'answer2' => "Petroli",
        'answer3' => "Energia solar",
        'answer4' => "Nuclear",
        'correct_answer' => "Petroli",
    ]);
    $answers = [$question->answer1, $question->answer2, $question->answer3, $question->answer4];

    $this->assertContains($question->correct_answer, $answers);

    $response = $this->get('/api/questions');
    $response->assertStatus(200);

    $response->assertJsonFragment([
        'content' => $question->content,
        'answer1' => $question->answer1,
        'answer2' => $question->answer2,
        'answer3' => $question->answer3,
        'answer4' => $question->answer4,
        'correct_answer' => $question->correct_answer
    ]);
});

it('can return one random question', function () {
    $questions = Question::factory(10)->create();

    $response = $this->get('/api/questions/random');
    $response->assertStatus(200);
    $data = json_decode($response->getContent(), true);
    expect($data)->toHaveKeys(['question','message']);
    //two fields: one for the question and one for the message
    expect(count($data))->toBe(2);
});