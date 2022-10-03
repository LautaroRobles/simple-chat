<template>
  <v-container fluid fill-height>
    <v-overlay color="green darken-4" :value="connecting" opacity="1">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-overlay>
    <div class="d-flex flex-column chat-container">
      <v-card class="chat-messages mb-3 pa-2">
        <template v-for="(message, i) in messages">
          <div v-if="message.special" class="pt-2" :key="i">
            <a class="grey--text">{{message.content}}</a>
          </div>
          <div v-else :class="`d-flex ${message.external ? 'justify-start' : 'justify-end'}`" :key="i">
            <v-card
              :class="`message-box ${message.external ? 'left' : 'right'} ${message.first ? '' : 'no-triangle'} ma-2 mb-0 pa-2`">
              <div class="message-sender green--text text-left font-weight-bold"
                v-if="message.external && message.first">
                {{message.sender}}
              </div>
              <div class="message-content text-left">
                {{message.content}}
              </div>
            </v-card>
          </div>
        </template>
      </v-card>
      <v-card>
        <v-form class="d-flex" @submit.prevent="send_message_to_every_connection">
          <v-text-field solo append-icon="mdi-send" hide-details="" placeholder="Escribe un mensaje aquí"
            v-model="message_field"></v-text-field>
        </v-form>
      </v-card>
    </div>
  </v-container>
</template>

<script>

export default {
  props: {
    server_id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      connecting: true,
      connections: {},
      messages: [],
      message_field: ""
    }
  },
  methods: {
    send_message_to_every_connection() {
      for (const [id, conn] of Object.entries(this.connections)) {
        console.log('Sending message to:', id);
        conn.send({
          content: this.message_field
        });
      }

      let is_first = this.messages.length == 0 || this.messages[this.messages.length - 1].sender != this.$peer.id;

      this.messages.push({
        sender: this.$peer.id,
        first: is_first,
        external: false,
        content: this.message_field
      });

      this.message_field = "";
    },
    handle_connection(conn) {
      conn.on('open', () => {
        this.messages.push({ special: true, content: `${conn.peer} se ha unido` });
        this.connecting = false;
        this.connections[conn.peer] = conn;
        conn.on('data', (data) => this.handle_data(data, conn));
        conn.on('close', () => this.handle_connection_closed(conn));
      });
      this.$peer.on('error', () => this.handle_connection_error(conn));
    },
    handle_connection_closed(conn) {
      delete this.connections[conn.peer];
      this.messages.push({ special: true, content: `${conn.peer} se ha desconectado` });
      console.log('Disconnected: ', conn.peer);
    },
    handle_connection_error(conn) {
      console.log('No se pudo conectar a: ', conn.peer);
    },
    handle_data(data, conn) {
      console.log('Received from: ', conn.peer);

      let is_first = this.messages.length == 0 || this.messages[this.messages.length - 1].sender != conn.peer;

      let new_message = {
        sender: conn.peer,
        first: is_first,
        external: true,
        content: data.content
      }

      this.messages.push(new_message);
    }
  },
  created() {
    let me = this.$peer;

    me.on('open', () => {
      console.log('My PeerJS ID is:', me.id);
    })

    me.on('connection', (conn) => this.handle_connection(conn));

    if (this.server_id != "") {
      this.connecting = true;
      let conn = me.connect(this.server_id);
      this.handle_connection(conn);
    }
    else {
      this.connecting = false;
    }
  },
  destroyed() {
    for (const [id, conn] of Object.entries(this.connections)) {
      console.log('Disconnecting from:', id);
      conn.close();
    }
    this.connections = {};
  },
}
</script>

<style>
.chat-container {
  width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: auto;
}

.chat-messages {
  height: 100%;
  border-color: rgba(0, 0, 0, 0.38) !important;
  overflow-y: auto;
}

.message-box {
  display: inline-block;
  overflow-wrap: anywhere;
  max-width: 600px;
}

.message-box.left {
  background: #424242;
  border-top-left-radius: 0px !important;
}

.message-box.right {
  background: #2E7D32;
  border-top-right-radius: 0px !important;
}

.message-box::before {
  content: "";
  display: block;
  position: absolute;
  top: 0px;
}

.message-box.left::before {
  left: -10px;
  border-top: 5px solid #424242;
  border-bottom: 5px solid transparent;
  border-right: 5px solid #424242;
  border-left: 5px solid transparent;
}

.message-box.right::before {
  right: -10px;
  border-top: 5px solid #2E7D32;
  border-bottom: 5px solid transparent;
  border-right: 5px solid transparent;
  border-left: 5px solid #2E7D32;
}

.message-box.no-triangle::before {
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
}

.message-sender {
  text-align: left;
}
</style>