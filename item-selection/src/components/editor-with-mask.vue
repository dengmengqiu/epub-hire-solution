<template>
  <div @mousedown.capture="onMouseDown" 
    @mousemove="onMouseMove"
    @mouseup="onmouseup"
    ref="boxRef"
    class="box">
    <Masker v-if="mask" :selectArea="selectArea"></Masker>
    <ItemOverlay v-for="item in itemGroup"  :selectArea="selectArea" v-on:updateItemActivedSatate="updateItemActivedSatate" :key="item.id" :item="item" />
  </div>
</template>

<script>
import Masker from "./mask.vue";
import ItemOverlay from "./item-overlay.vue";

export default {
  components: {
    Masker,
    ItemOverlay
  },
  props: ["itemGroup"],
  data() {
    return {
      boxPos: [],
      selectArea: {
        pos: [0, 0],   // 选中区域左上顶点
        size: [0, 0]
      },
      start: [],      /// 鼠标按下的点
      mask: false,       // 是否显示选中区域
      items: this.itemGroup
    }
  },
  methods: {
    onMouseDown(e) {
      // 先取消选中
      if (!this.mask) {
        this.$set(this.selectArea, 'size', [0, 0])
        this.items.forEach(item => item.actived = false)
      }
      this.mask = true
      // 获取容器的位置 -- 用于计算鼠鼠标相对容器位置
      const boxPos = [this.$refs.boxRef.getBoundingClientRect().left, this.$refs.boxRef.getBoundingClientRect().top];
      const posX = e.clientX  - boxPos[0], posY = e.clientY - boxPos[1]; 
      this.$set(this.selectArea, 'pos', [posX, posY])
      this.start =  [e.clientX, e.clientY]
    },
    onMouseMove(e) {
      if (!this.mask) return
      let posX = this.start[0], posY = this.start[1];
      let width = e.clientX - posX,height = e.clientY - posY;
      // 选中区域pos取矩形左上顶点
      if (e.clientX < posX) {
        width = posX - e.clientX;
        posX = e.clientX;
      } 
      if (e.clientY < posY) {
        height = posY - e.clientY;
        posY = e.clientY;
      } 

      // 获取容器的位置 -- 用于计算鼠鼠标相对容器位置
      const boxPos = [this.$refs.boxRef.getBoundingClientRect().left, this.$refs.boxRef.getBoundingClientRect().top];
      this.$set(this.selectArea, 'pos', [posX - boxPos[0], posY - boxPos[1]])
      this.$set(this.selectArea, 'size', [width, height]);
    },
    onmouseup() {
      this.mask = false;

      //打印选中的元素
      this.printSelectItems()
    },
    // 控制台打印选中元素
    printSelectItems() {
      function SelectItem(id, value) {
        this.id = id;
        this.value = value;
      }
      let selectItems = []
      this.items.forEach(item => {
        if (item.actived == true)  {
          selectItems.push(new SelectItem(item.id, item.value))
        }
      });
      console.table(selectItems)
    },
    // 更新元素选中状态
    updateItemActivedSatate(id, actived) {
      this.items.forEach(item => {
        if (item.id == id)  {
          item.actived = actived
        }
      });
    }
  }
};
</script> 

<style scoped>
.box {
  width: 100%;
  height: 100%
}
</style>
