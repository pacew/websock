// plainjs

var websock;
var last_conn_attempt = 0;
var last_msg = 0;

function get_secs() {
  return(Date.now() / 1000.0);
}

function handle_msg(ev) {
  last_msg = get_secs();
  var msg = JSON.parse(ev.data);
  console.log(msg)
}

function maintain_connection() {
  if (websock == null || websock.readyState == WebSocket.CLOSED) {
    if (get_secs () - last_conn_attempt >= 1) {
      last_conn_attempt = get_secs();
      var url = "ws://"+location.host+"/ws";
      websock = new WebSocket(url);
      websock.onmessage = handle_msg;
    }
  }
}

function do_watchdog() {
  maintain_connection ();

  var elt = document.getElementById('websocket_status');
  if (get_secs() - last_msg < 2) {
    elt.style.display = 'none'
  } else {
    elt.style.display = 'block'
  }
}

last_msg = get_secs ();
document.addEventListener('DOMContentLoaded', function(){
  window.setInterval(do_watchdog, 100);
});
