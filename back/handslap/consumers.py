# consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer

# channels and groups


connected_players = []
index = 0

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        connected_players.append(self)

        print ("Connected", len(connected_players))
        # if len (connected_players) == 2:
        #     print("two  Players  connected")
        #     self.room_name = f'game_{index}'
        #     self.room_group_name = f'game_{index}'

        #     # Add the player to the group 
        #     await self.channel_layer.group_add(
        #         self.room_group_name,
        #         self.channel_name
        #     )
        # else:
        #     await self.accept()

        await self.accept()

        await self.send(text_data=json.dumps({
            'message': 'Connected'
        }))
    index += 1
    async def disconnect(self, close_code):
        print("Disconnected")


    async def receive(self, text_data):
    
        text_data_json = json.loads(text_data)
        message = text_data_json['message']


        # print("Received: ", message)
        # print("Sending: ", message)

        await self.send(text_data=json.dumps({
            'message': message
        }))