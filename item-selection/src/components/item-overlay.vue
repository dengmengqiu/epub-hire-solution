<template>
  <div :class="className" :style="style" data-type="type">
    <div class="el-button-mix">{{item.value}}</div>
  </div>
</template>

<script>
export default {
  props: ["item", "selectArea"],

  computed: {
    className() {
      let className = "item";
      const posX = this.selectArea.pos[0], posY = this.selectArea.pos[1], width = this.selectArea.size[0], height = this.selectArea.size[1];
      if ((this.item.pos[0] + this.item.size[0]) <  posX || this.item.pos[0] > (posX + width) || this.item.pos[1] > (posY + height) || (this.item.pos[1] + this.item.size[1]) < posY) {
        // 未被选中
        className = "item"
        this.$emit("updateItemActivedState", this.item.id, false)
      } else {
        className += " actived";
        this.$emit("updateItemActivedSatate", this.item.id, true)
      }
      return className;
    },
    style() {
      const {
        pos: [x, y],
        size: [w, h]
      } = this.item;

      return {
        transform: `translate(${x}px, ${y}px)`,
        width: `${w}px`,
        height: `${h}px`,
      };
    }
  }
};
</script> 
