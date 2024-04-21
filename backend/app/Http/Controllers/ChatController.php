<?php

namespace App\Http\Controllers;

use App\Events\MyEvent;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function getConversations()
    {
        $user = auth()->user();
        $conversations = Conversation::where('user1_id', $user->id)
            ->orWhere('user2_id', $user->id)
            ->orderBy('last_message', 'asc')
            ->get();

        return response()->json(['conversations' => $conversations]);
    }
    public function getMessages($id)
    {
        $messages = Message::where('conversation_id', $id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['messages' => $messages]);
    }

    public function sendMessage(Request $request, $id)
    {
        $user = auth()->user();

        $conversation = Conversation::findOrFail($id);
        if ($user->id != $conversation->user1_id && $user->id != $conversation->user2_id) {
            return response()->json(['error' => 'No tens permisos per enviar missatges a aquesta conversa', 403]);
        }

        $message = new Message([
            'user_id' => $user->id,
            'content' => $request->input('content'),
            'conversation_id' => $id
        ]);
        $message->save();
        event(new MyEvent($message));

        $conversation->last_message = now();
        $conversation->save();

        return response()->json(['message' => 'Missatge enviat amb èxit']);
    }
}
