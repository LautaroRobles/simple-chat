<template>
  <v-container fluid>
    <v-card tile>
      <v-list>
        <v-subheader>Chats</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item v-for="(chat, i) in chats" :key="i" :to="{name: 'chat', params: {server_id: chat.id}}">

            <v-list-item-content>
              <v-list-item-title>{{chat.title}}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey lighten-1">mdi-information</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      chats: [
        {
          title: 'Un chat',
          id: 'ed69ac1e-ca50-4982-ae60-ab799cf3c9a1'
        }
      ]
    }
  },
}
</script>

<style>

</style>