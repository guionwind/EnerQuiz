<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Models\Comarca;
use App\Models\Municipi;
use App\Models\Friend;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use function Termwind\renderUsing;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call(UserSeeder::class);

        $this->call(FriendSeeder::class);

        $this->call(PrizeSeeder::class);
        
        //the call with real data takes a LONG time to complete
        $this->call(MunicipisIComarquesSeeder::class);

        //Comarca::factory(5)->has(Municipi::factory(10))->create();

        $this->call(QuestionsSeeder::class);

        $this->call(QuestionsMunicipiSeeder::class);

        $this->call(ConversationSeeder::class);

    }
}
