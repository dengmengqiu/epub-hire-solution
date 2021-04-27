<template>
  <svg class="mask" :style="style" />
</template>

<script>
export default {
  props: ["selectArea"],

  computed: {
    style() {
      const {
        pos: [x, y],
        size: [w, h]
      } = this.selectArea;

      return {
        transform: `translate(${x}px, ${y}px)`,
        width: `${w}px`,
        height: `${h}px`
      };
    }
  }
};
</script>