import json
from channels.generic.websocket import AsyncWebsocketConsumer


class GameConsumer(AsyncWebsocketConsumer):
    connected_players = []
    index = 0
    async def connect(self):
        GameConsumer.connected_players.append(self)

        print ("Connected", len(GameConsumer.connected_players))
        if len (GameConsumer.connected_players) == 2:
            print("two  Players  connected")
            self.room_name = f'game_{GameConsumer.index}'
            self.room_group_name = f'game_{GameConsumer.index}'

            for player in GameConsumer.connected_players:
                await self.channel_layer.group_add(
                    self.room_group_name,
                    player.channel_name
                )
                player.room_group_name = self.room_group_name
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_message',
                    'message': 'Start Game'
                }
            )
            
            GameConsumer.connected_players = []
            GameConsumer.index += 1

        else:
            print("Waiting for other player")
            self.room_group_name = None

        await self.accept()
        
        await self.send(text_data=json.dumps({
            'message': 'Connected'
        }))

    async def disconnect(self, close_code):
        print("Disconnected")
        if self in GameConsumer.connected_players:
            GameConsumer.connected_players.remove(self)
        if self.room_group_name:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json['message']
            # print("Received: ", message)
            # print("Sending: ", message)
            if self.room_group_name:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'game_message',
                        'message': message
                    }
                )
            else:
                await self.send(text_data=json.dumps({
                    'message': 'Waiting for other player'
                }))
        except:
            print("Error")

    async def game_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))