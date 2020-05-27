(() => {
  let yOffset; //pageYOffset의 값
  let prevScrollHeight; //현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합..현재 씬을 찾는데 사용
  let currScene; //현재 활성화된(윈도우에 보여지는) 씬(scroll-section)
  const sceneInfo = [
    {
      //0
      type: "sticky",
      //애니메이션 스크롤의 높이
      heightNum: 5, //브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-0"),
        messageA: document.querySelector("#scroll-section-0 .a"),
        messageB: document.querySelector("#scroll-section-0 .b"),
        messageC: document.querySelector("#scroll-section-0 .c"),
        messageD: document.querySelector("#scroll-section-0 .d"),
      },
      values: {
        messageA_opacity: [0, 1],
      },
    },
    {
      //1
      type: "normal",
      heightNum: 5, //브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
      },
    },
    {
      //2
      type: "sticky",
      heightNum: 5, //브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"),
      },
    },
    {
      //3
      type: "sticky",
      heightNum: 5, //브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"),
      },
    },
  ];

  function setLayout() {
    //각 스크롤 섹션의 높이 셋팅
    sceneInfo.forEach((scene) => {
      scene.scrollHeight = scene.heightNum * window.innerHeight;
      scene.objs.container.style.height = `${scene.scrollHeight}px`;
    });

    yOffset = window.pageYOffset;

    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currScene = i;
        break;
      }
    }
    document.body.setAttribute("id", `show-scene-${currScene}`);
  }
  //값변화 계산
  function calcValues(values, currentYOffset) {
    let rv;
    // 현재 씬에서 스크롤된 범위를 비율로 구하기
    let scrollRatio = currentYOffset / sceneInfo[currScene].scrollHeight;
    rv = scrollRatio * (values[1] - values[0]) + values[0];
    return rv;
  }

  //애니메이션 처리
  function playAnim() {
    const obj = sceneInfo[currScene].objs;
    const values = sceneInfo[currScene].values;
    //현재 씬에서  스크롤된 높이
    const currentYOffset = yOffset - prevScrollHeight;
    // console.log(currentYOffset, currScene);
    switch (currScene) {
      case 0:
        // console.log(0);
        let messageA_opacity_in = calcValues(
          values.messageA_opacity,
          currentYOffset
        );
        obj.messageA.style.opacity = messageA_opacity_in;
        break;
      case 1:
        // calcValues();
        // console.log(1);
        break;
      case 2:
        // calcValues();
        // console.log(2);
        break;
      case 3:
        // calcValues();
        // console.log(3);
        break;
    }
  }

  function scrollLoop() {
    prevScrollHeight = 0; //루프를 돌때마다 0으로 만들어줘야함
    for (let i = 0; i < currScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    //스크롤다운
    if (yOffset > prevScrollHeight + sceneInfo[currScene].scrollHeight) {
      currScene++;
      document.body.setAttribute("id", `show-scene-${currScene}`);
    }
    //스크롤업
    else if (yOffset < prevScrollHeight) {
      if (currScene === 0) return; //브라우저 바운스 효과로 마이너스가 되는것을 방지
      currScene--;
      document.body.setAttribute("id", `show-scene-${currScene}`);
    }
    playAnim();
  }

  window.addEventListener("scroll", () => {
    yOffset = window.pageYOffset;
    //현재스크롤의Y값
    scrollLoop();
  });
  //창 사이즈가 바뀔때 발생
  // window.addEventListener("DOMContentLoaded", setLayout);
  window.addEventListener("load", setLayout);
  window.addEventListener("resize", setLayout);
})();
