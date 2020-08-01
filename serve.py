#! /usr/bin/env python3

import asyncio
from aiohttp import web
import json

serve_port = 8111
websocket_update_interval = 1 # seconds
background_interval = 1 # seconds


# One instance of the State class is shared between the backround task
# and the websocket handler(s).  By default, asyncio switches only at
# yield points (await's), so modifications to state that don't yield
# don't need any locking.
class State:
    pass

state = State()
state.count = 0

def background_step():
    state.count += 1

def make_status():
    msg = dict()
    msg['count'] = state.count
    return(json.dumps(msg))

# ================================================================
# generic setup stuff below here

async def serve_index(req):
    val = open("index.html").read()
    return web.Response(text=val, content_type='text/html')

async def serve_scripts(req):
    val = open("scripts.js").read()
    return web.Response(text=val, content_type='application/javascript')

async def serve_style(req):
    val = open("style.css").read()
    return web.Response(text=val, content_type='text/css')

async def websocket_handler(req):
    ws = web.WebSocketResponse()
    await ws.prepare(req)

    while True:
        await ws.send_str(make_status())
        await asyncio.sleep(websocket_update_interval)

async def web_server():
    app = web.Application()
    app.router.add_get('/', serve_index)
    app.router.add_get('/scripts.js', serve_scripts)
    app.router.add_get('/style.css', serve_style)
    app.router.add_get('/ws', websocket_handler)

    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, 'localhost', serve_port)
    await site.start()

async def background_task():
    while True:
        background_step ()
        await asyncio.sleep(background_interval)

print(f"http://localhost:{serve_port}/")

asyncio.get_event_loop().run_until_complete(web_server())
asyncio.get_event_loop().run_until_complete(background_task())
asyncio.get_event_loop().run_forever()

