import consumer from "./consumer";

consumer.subscriptions.create("GlobalChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
    console.log("Connected to the GlobalChannel");
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
    console.log("Disconnected to the GlobalChannel");
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
    console.log("Received data from GlobalChannel", data);
    if (data.redirect_to) {
      window.location.href = data.redirect_to;
    }
  },
});
