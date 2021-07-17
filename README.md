# [WidthControl](https://aleksandr-zero.github.io/WidthControl/app/)

A simple script to control the width of<br>
an element when scrolling the window.

## Getting start

Connection JS:

```xml
<script src="https://aleksandr-zero.github.io/WidthControl/WidthControl/widthControl.js"></script>
```

```xml
<!-- Main container -->
<div class="width-control-container">
  <!-- Your blocks -->
  <div class="width-control-block-1">
    <p>Lorem ipsum dolor sit.</p>
  </div>
  <div class="width-control-block-2">
    <p>Lorem ipsum dolor sit.</p>
  </div>
</div>
```

**<span style="border-bottom: 1px solid #000000;">
Blocks are basically containers should contain a line in the class: `width-control-block`;<br>
Must be numbered: Must be numbered `-<int>`!
</span>**


```js
const blockContainer = document.querySelector(".width-control-container");

const newWidthControl = new WidthControl(blockContainer, {
  1: {
    effect: "enlarge",
    percent: 30
  },
  2: {
    effect: "reduce",
    percent: 25
  }
});
```

## Options

| Parameter  		  | Description                  | Type |
|-----------------|------------------------------|------|
| `int` | The serial number of the block, for setting the settings | `int` |
| `<int>.effect` | What action to perform on this element. **Parameter**: `(reduce \ enlarge)`. | `str` |
| `<int>.percent` | Shows by what percentage to increase or decrease the block (calculates from the entire block length) | `int` | 


```js
new WidthControl(..., {
  1: {
    effect: "enlarge",
    percent: 30
  },
  2: {
    effect: "reduce",
    percent: 25
  }
})
```
