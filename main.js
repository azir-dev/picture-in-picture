import "./style.css";

// DOM
const mediaBtn = document.getElementById("media");
const startBtn = document.getElementById("start");
const videoEl = document.getElementById("video");

async function promptDisplayMedia() {
  try {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia();
    videoEl.srcObject = mediaStream;
    // 结束共享屏幕时清空videoEl中的媒体流对象，让异常成功捕获
    mediaStream
      .getVideoTracks()[0]
      .addEventListener("ended", () => (videoEl.srcObject = null));
    // 加载完成后自动播放 autoplay
    videoEl.onloadedmetadata = () => {
      videoEl.play();
    };
  } catch (error) {
    console.log(error.name === "NotAllowedError");
    if (error.name === "NotAllowedError") {
      alert("您拒绝了窗口的分享请求");
    } else {
      alert(error);
    }
  }
}

// 点击开始按钮直接开始画中画模式
startBtn.addEventListener("click", () => {
  if (!document.pictureInPictureEnabled) return alert("浏览器不支持画中画模式");
  videoEl.requestPictureInPicture().catch((err) => {
    if (err.name === "InvalidStateError")
      return alert("需要添加一个分享的窗口作为媒体流");
    alert(err);
  });
});

// 事件处理
mediaBtn.addEventListener("click", promptDisplayMedia);
