const socket = new WebSocket('ws://127.0.0.1:8000/slap/match/')

socket.onopen = () => {

    console.info("socker opened")
    const data = {
        type: "random",
    }
    socket.send(JSON.stringify(data))
}


socket.onmessage = (event) => {
    let r_data = JSON.parse(event.data)
    console.log(r_data)
    if (r_data.m == 'g') {
        if ('b' in r_data )
        {
            game.ball.x = r_data.b.x
            game.ball.y = r_data.b.y
        }
        if ('p' in r_data)
        {
            game.p1.paddle.newY = r_data.p.p1.y;
            game.p2.paddle.newY = r_data.p.p2.y;
        }
        if ('s' in r_data)
        {
            game.score1 = r_data.s.p1
            game.score2 = r_data.s.p2
        }

    }
    else if (r_data.m == "opp")  
    {
        socket.send(JSON.stringify({
            "m": "rd"
        }))
    }  
    else if (r_data.m == "st")
    {
        
    }

    else if (r_data.m == "win")
        alert("You win")

    else if (r_data.m == "lose")
        alert("You lose")
    else if (r_data.m == "err")
        alert(r_data.err)

}