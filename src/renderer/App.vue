<template>
  <div id="app">
    <entry></entry>
  </div>
</template>

<script >
import Entry from "./components/entry";
export default {
  name: "music",
  components: {
    Entry
  }
}
</script>

<style>
/* CSS */
* {
  user-select: none;
  cursor: default;
}
</style>
