<template>
  <div class="home">
    <div class="hero">
      <h1 class="hero-title">A Twitch Bot</h1>
      <div class="hero-desc">A multi-channel bot. You need this as a Devious Streamer.</div>
      <div class="hero-button">
        <Button @click.native="loginWithTwitch">
          Login with Twitch
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '../components/Button';

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:8888' : 'to-do';

export default {
  components: {
    Button
  },
  created() {
    window.addEventListener('message', event => {
      console.log(event);
    })
  },
  methods: {
    loginWithTwitch() {
      const h = 720;
      const w = 720;
      const left = (screen.width / 2) - (w / 2);
      const top = (screen.height / 2) - (w / 2);
      const win = window.open(
        `${API_URL}/auth/twitch?`,
        'Login with Twitch',
        `width=${w},height=${h},top=${top},left=${left}`
        );
    }
  }
};
</script>

<style lang="scss">
  .home {
    display: flex;
    justify-content: center;
  }
  .hero {
    margin-top: 1em;
    padding: 3em;
    background: hsl(0, 0%, 18%);
    display: flex;
    flex-direction: column;
    &-title{
      font-size: 4em;
    }
    &-desc{
      font-size: 2em;
      margin-bottom: 1em;
    }
    &-button {
      align-self: center;
    }
  }
</style>