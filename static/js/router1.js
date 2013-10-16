function startIntro(){
  var intro = introJs();
    intro.setOptions({
      steps: [
        {
          element: '.step1',
          intro: "第一步是连通外网，看到此处为对勾说明外网已经连接成功，否则说明失败。"
        },
        {
          element: '.step2',
          intro: "第二步设置无线配置",
          position: 'left'
        },
        {
          element: '.step3',
          intro: '访问<span style="color: red;">应用商店</span><span style="color: green;">',
          position: 'left'
        }
        
       
      ]
    });

    intro.start();
}