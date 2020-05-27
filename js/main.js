(() => {
  let yOffset; //pageYOffset의 값
  let prevScrollHeight; //현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합..현재 씬을 찾는데 사용
  let currScene; //현재 활성화된(윈도우에 보여지는) 씬(scroll-section)
  let enterNewScene = false; //새로운 scene이 시작된 순간 true

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
        //start, end 애니메이션 구간
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
        messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
        messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
        // messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
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
    const scrollHeight = sceneInfo[currScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
      // start ~ end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;
      if (
        currentYOffset >= partScrollStart &&
        currentYOffset <= partScrollEnd
      ) {
        rv =
          ((currentYOffset - partScrollStart) / partScrollHeight) *
            (values[1] - values[0]) +
          values[0];
      } else if (currentYOffset < partScrollStart) {
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }
    return rv;
  }

  //애니메이션 처리
  function playAnim() {
    const objs = sceneInfo[currScene].objs;
    const values = sceneInfo[currScene].values;
    //현재 씬에서  스크롤된 높이
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;
    // console.log(currScene);
    switch (currScene) {
      case 0:
        // console.log(0);
        const messageA_opacity_in = calcValues(
          values.messageA_opacity_in,
          currentYOffset
        );
        const messageA_opacity_out = calcValues(
          values.messageA_opacity_out,
          currentYOffset
        );
        const messageA_translateY_in = calcValues(
          values.messageA_translateY_in,
          currentYOffset
        );
        const messageA_translateY_out = calcValues(
          values.messageA_translateY_out,
          currentYOffset
        );

        if (scrollRatio <= 0.22) {
          //in
          objs.messageA.style.opacity = messageA_opacity_in;
          objs.messageA.style.transform = `translateY(${messageA_translateY_in}%)`;
        } else {
          //out
          objs.messageA.style.opacity = messageA_opacity_out;
          objs.messageA.style.transform = `translateY(${messageA_translateY_out}%)`;
        }

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
  //씬전환
  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0; //루프를 돌때마다 0으로 만들어줘야함
    for (let i = 0; i < currScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    //스크롤다운
    if (yOffset > prevScrollHeight + sceneInfo[currScene].scrollHeight) {
      enterNewScene = true;
      currScene++;
      document.body.setAttribute("id", `show-scene-${currScene}`);
    }
    //스크롤업
    else if (yOffset < prevScrollHeight) {
      enterNewScene = true;
      if (currScene === 0) return; //브라우저 바운스 효과로 마이너스가 되는것을 방지
      currScene--;
      document.body.setAttribute("id", `show-scene-${currScene}`);
    }
    //enterNewScene이 true일때 바로 반환
    if (enterNewScene) return;
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
