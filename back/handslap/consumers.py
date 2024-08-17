# consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer

# channels and groups


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send(text_data=json.dumps({
            'message': 'Connected'
        }))

    async def disconnect(self, close_code):
        print("Disconnected")

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        print("Received: ", message)
        print("Sending: ", message)

        await self.send(text_data=json.dumps({
            'message': message
        }))