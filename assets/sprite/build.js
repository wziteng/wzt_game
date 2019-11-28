cc.Class({
    extends: cc.Component,

    properties: {
        rect0:cc.Prefab,
        rect1:cc.Prefab,
        rect2:cc.Prefab,
        rect3:cc.Prefab,
        rect4:cc.Prefab,
        rect5:cc.Prefab,
        rect6:cc.Prefab,
        player:cc.Prefab,
        basepoint:cc.Prefab,
        button:cc.Node,
        buttom:cc.Node,
        score:cc.Label,
        over:cc.Node,
        sliderv:cc.Slider,
        // audio:cc.AudioClip,
    },

onLoad: function () {
    //    cc.audioEngine.playEffect(this.audio, true);
       this.xingtai=0;
       this.prefab;
       this.jmix;//j的边界最小最大值
       this.jmax;
       this.out=0;
       this.speed=0.3;
       this.scorenum=0;
       this.one=[];  //one[1,2,3,4] 1就是第一个生成方块的y坐标,以此类推
       this.two=[];//two[1,2,3,4] 1就是第一个生成方块的x坐标,以此类推
       this.three=[];//therr[1,2,3,4] 1就是第一个生成方块是否是最底层,最底层为1,0为不是底层
       this.arry=[];//去重数组
       this.nextgoal=Math.floor(7*Math.random());
       this.gamestate=0;//游戏的状态
       this.touchx;//x的初始位置
       
       this.box=[];
       for(let i=0;i<20;i++){
           this.box[i]=[];
           for(let j=0;j<10;j++){
               if(i===0){
               this.box[i][j]=1;
               }else{
               this.box[i][j]=0;
               }
       }
    }
    //给下面三个按钮添加事件
    cc.log(this.buttom);
    for(let i =0;i<this.buttom.children.length;i++){
        let item = this.buttom.children[i];
       item.on(cc.Node.EventType.TOUCH_START,this._onTouchStart.bind(this,i),this);
    }
    //键盘事件
       cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
       this.setcolour();
       
    },
setcolour(){
     this.i=17;
     this.j=5;
     var goal=this.nextgoal;
     this.gameover(); //判断是否结束游戏
     this.buildbody(goal);
     this.drawnext();
},//获取颜色后实例化7种图像
buildbody(goal){
    cc.log('实例化：'+goal)
    if(goal===0){this.prefab=this.rect0;}
    if(goal===1){this.prefab=this.rect1;}
    if(goal===2){this.prefab=this.rect2;}
    if(goal===3){this.prefab=this.rect3;}
    if(goal===4){this.prefab=this.rect4;}
    if(goal===5){this.prefab=this.rect5;}
    if(goal===6){this.prefab=this.rect6;}
    this.type=goal;
    //一个方块形状由四个小方块形成
    this.rectyi=cc.instantiate(this.prefab).getComponent('rect');
    this.recter=cc.instantiate(this.prefab).getComponent('rect');
    this.rectsan=cc.instantiate(this.prefab).getComponent('rect');
    this.rectsi=cc.instantiate(this.prefab).getComponent('rect');
    this.point=cc.instantiate(this.basepoint).getComponent('move');
    var box=cc.find('Canvas/box');
    box.addChild(this.point.node);
    box.addChild(this.rectyi.node);
    box.addChild(this.recter.node);
    box.addChild(this.rectsan.node);
    box.addChild(this.rectsi.node);
    this.xingtai=0;
    this.schedule(this.down,this.speed);//速度,没一个时间段执行一次down,值就相应减
},
down(){
    if(this.gamestate===0){//大范围内加一个加一个检测，防止重合
    
    this.i--;///通过这个值,判断是否产生了碰撞,当等于0时就是产生了碰撞
    this.choose();
    for(let i=0;i<4;i++){
        cc.log('23243');
            if(this.box[this.one[i]][this.two[i]]===1){
                this.i++;
                cc.log('hahaha1111');
                this.choose();
            }
    }
    this.check();
    }
},
//选择生成的图为什么样
choose(){
    cc.log('hahah');
    if(this.type===0){this.buildone();}
    if(this.type===1){this.buildtwo();}
    if(this.type===2){this.buildthree();}
    if(this.type===3){this.buildfour();}
    if(this.type===4){this.buildfive();}
    if(this.type===5){this.buildsix();}
    if(this.type===6){this.buildseven();}
 },
check(){
    for(let i=0;i<this.one.length;i++){
        if(this.three[i]===1){
            cc.log(this.one[i]+','+this.two[i]);
            cc.log(this.one[i]-1+','+this.two[i]);
            cc.log(this.box[this.one[i]-1][this.two[i]]);
        if(this.box[this.one[i]-1][this.two[i]]===1){ //碰撞上了,检测的作用
            this.box[this.one[0]][this.two[0]]=1;
            this.box[this.one[1]][this.two[1]]=1;
            this.box[this.one[2]][this.two[2]]=1;
            this.box[this.one[3]][this.two[3]]=1;
            this.rectyi.node.name =this.one[0].toString()+this.two[0].toString();
            cc.log('节点名：'+this.rectyi.node.name);
            this.recter.node.name =this.one[1].toString()+this.two[1].toString();
            cc.log('节点名：'+this.recter.node.name );
            this.rectsan.node.name=this.one[2].toString()+this.two[2].toString();
            cc.log('节点名：'+this.rectsan.node.name);
            this.rectsi.node.name =this.one[3].toString()+this.two[3].toString();
            cc.log('节点名：'+this.rectsi.node.name);
            this.unschedule(this.down);//停止下降
            this.setcolour();//重新生成
            break;//防止以上三个用法被多次循环调用
            }
        }
    }
    this.cleancheck();//检测是否可以清除
    this.arry.length=0;
    
},
cleancheck(){
    for(let i=1;i<17;i++){
        var sum=0
        for(let j=0;j<10;j++){
               if(this.box[i][j]===1){
                   sum++
                   if(sum===10){
                       cc.log('i:'+i);
                       this.clealine(i);
             }
          }
       }
    }
},
clealine(i){
for(let j=0;j<10;j++){
    var url='Canvas/box/'+i.toString()+j.toString();
    let jiedian=cc.find(url);
          jiedian.removeFromParent();
          this.box[i][j]=0;
    }
    this.addscore();
    this.dropcheck(i);
    this.cleancheck();
},
dropcheck(line){
    for(let i=1;i<17;i++){
        if(i>line){
        for(let j=0;j<10;j++){
            if(this.box[i][j]===1){
                var url='Canvas/box/'+i.toString()+j.toString();
                let jiedian=cc.find(url);
                jiedian.y-=50;
                var yi=i-1;
                cc.log('第一个掉落的节点名：'+jiedian.name);
                jiedian.name=yi.toString()+j.toString();
                this.box[i][j]=0;
                this.box[i-1][j]=1;
            }
        }
    }
}
},
buildone(){//一号图形
    //this.i=17;
    //this.j=4;
    var i=this.i;var j=this.j;
    //出图为位置
    this.rectyi.node.x=j*50;this.rectyi.node.y=i*50;
    this.recter.node.x=(j+1)*50;this.recter.node.y=i*50
    this.rectsan.node.x=j*50;this.rectsan.node.y=(i+1)*50;
    this.rectsi.node.x=(j+1)*50;this.rectsi.node.y=(i+1)*50;
    this.jmix=j;this.jmax=j+1;
    this.one[0]=i;  this.two[0]=j;  this.three[0]=1;//第一个生成的正方形,在底部
    this.one[1]=i;  this.two[1]=j+1;this.three[1]=1;//第二个生成的正方形,在底部
    this.one[2]=i+1;this.two[2]=j;  this.three[2]=0;//第三个生成的正方形,在上部
    this.one[3]=i+1;this.two[3]=j+1;this.three[3]=0;//第四个生成的正方形,在上部
},
buildtwo(){//二号图形
    var i=this.i;var j=this.j;
    if(this.xingtai===2){this.xingtai=0}
    if(this.xingtai===0){
    this.rectyi.node.x=j*50;this.rectyi.node.y=(i+1)*50;
    this.recter.node.x=j*50;this.recter.node.y=i*50
    this.rectsan.node.x=(j-1)*50;this.rectsan.node.y=i*50;
    this.rectsi.node.x=(j-1)*50;this.rectsi.node.y=(i-1)*50;
    this.jmix=j-1;this.jmax=j;
    this.one[0]=i+1;this.two[0]=j;  this.three[0]=0;
    this.one[1]=i;  this.two[1]=j;  this.three[1]=1;
    this.one[2]=i;  this.two[2]=j-1;this.three[2]=0;
    this.one[3]=i-1;this.two[3]=j-1;this.three[3]=1;
    }
    if(this.xingtai===0&&this.jmax===8){this.out=-1};//出图的归位
    if(this.xingtai===1){
    this.rectyi.node.x=j*50;this.rectyi.node.y=(i)*50;
    this.recter.node.x=(j-1)*50;this.recter.node.y=(i+1)*50
    this.rectsan.node.x=(j)*50;this.rectsan.node.y=(i+1)*50;
    this.rectsi.node.x=(j+1)*50;this.rectsi.node.y=(i)*50;
    this.jmix=j-1;this.jmax=j+1;
    this.one[0]=i;  this.two[0]=j;  this.three[0]=0;
    this.one[1]=i+1;this.two[1]=j-1;this.three[1]=1;
    this.one[2]=i+1;this.two[2]=j;  this.three[2]=0;
    this.one[3]=i;  this.two[3]=j+1;this.three[3]=1;
    }
},
buildthree(){//三号
    var i=this.i;var j=this.j;
    if(this.xingtai===4){this.xingtai=0}
    if(this.xingtai===0){
    this.rectyi.node.x=(j-1)*50;this.rectyi.node.y=i*50;
    this.recter.node.x=(j-1)*50;this.recter.node.y=(i+1)*50;
    this.rectsan.node.x=(j)*50;this.rectsan.node.y=(i+1)*50;
    this.rectsi.node.x=(j+1)*50;this.rectsi.node.y=(i+1)*50;
    this.jmix=j-1;this.jmax=j+1;
    this.one[0]=i;  this.two[0]=j-1;this.three[0]=1;//this.four[0]=1;this.five[0]=1;
    this.one[1]=i+1;this.two[1]=j-1;this.three[1]=0;//this.four[1]=1;this.five[1]=0;
    this.one[2]=i+1;this.two[2]=j;  this.three[2]=1;//this.four[2]=0;this.five[2]=0;
    this.one[3]=i+1;this.two[3]=j+1;this.three[3]=1;//this.four[3]=0;this.five[3]=1;
    
    }
    if(this.xingtai===1){
    this.rectyi.node.x=(j)*50;this.rectyi.node.y=(i+1)*50;
    this.recter.node.x=(j+1)*50;this.recter.node.y=(i+1)*50;
    this.rectsan.node.x=(j+1)*50;this.rectsan.node.y=(i)*50;
    this.rectsi.node.x=(j+1)*50;this.rectsi.node.y=(i-1)*50;
    this.jmix=j;this.jmax=j+1; 
    this.one[0]=i+1;this.two[0]=j;  this.three[0]=1;//this.four[0]=1;this.five[0]=0;
    this.one[1]=i+1;this.two[1]=j+1;this.three[1]=0;//this.four[1]=0;this.five[1]=1;
    this.one[2]=i;  this.two[2]=j+1;this.three[2]=0;//this.four[2]=1;this.five[2]=1;
    this.one[3]=i-1;this.two[3]=j+1;this.three[3]=1;//this.four[3]=1;this.five[3]=1;
    }
    if(this.xingtai===2){
    this.rectyi.node.x=(j+1)*50;this.rectyi.node.y=(i)*50;
    this.recter.node.x=(j+1)*50;this.recter.node.y=(i-1)*50;
    this.rectsan.node.x=(j)*50;this.rectsan.node.y=(i-1)*50;
    this.rectsi.node.x=(j-1)*50;this.rectsi.node.y=(i-1)*50;
    this.jmix=j-1;this.jmax=j+1;
    this.one[0]=i;  this.two[0]=j+1;this.three[0]=0;//this.four[0]=1;this.five[0]=1;   
    this.one[1]=i-1;this.two[1]=j+1;this.three[1]=1;//this.four[1]=0;this.five[1]=1;
    this.one[2]=i-1;this.two[2]=j;  this.three[2]=1;//this.four[2]=0;this.five[2]=0;
    this.one[3]=i-1;this.two[3]=j-1;this.three[3]=1;//this.four[3]=1;this.five[3]=0;
    }
    if(this.xingtai===3){
    this.rectyi.node.x=(j)*50;this.rectyi.node.y=(i-1)*50;
    this.recter.node.x=(j-1)*50;this.recter.node.y=(i-1)*50;
    this.rectsan.node.x=(j-1)*50;this.rectsan.node.y=(i)*50;
    this.rectsi.node.x=(j-1)*50;this.rectsi.node.y=(i+1)*50;
    this.jmix=j-1;this.jmax=j; 
    this.one[0]=i-1;this.two[0]=j;  this.three[0]=1;
    this.one[1]=i-1;this.two[1]=j-1;this.three[1]=1;
    this.one[2]=i;  this.two[2]=j-1;this.three[2]=0;
    this.one[3]=i+1;this.two[3]=j-1;this.three[3]=0; 
    }
    if(this.xingtai===1&&this.jmix===0){this.out=1};//出图的归位
    if(this.xingtai===3&&this.jmax===9){this.out=-1};//出图的归位
},
buildfour(){//四号  l型,他又有三种形态
    var i=this.i;var j=this.j;
    if(this.xingtai===4){this.xingtai=0}
    if(this.xingtai===0){
    this.rectyi.node.x=(j-1)*50;this.rectyi.node.y=i*50;
    this.recter.node.x=(j-1)*50;this.recter.node.y=(i-1)*50
    this.rectsan.node.x=(j)*50;this.rectsan.node.y=(i-1)*50;
    this.rectsi.node.x=(j+1)*50;this.rectsi.node.y=(i-1)*50;
    this.jmix=j-1;this.jmax=j+1;
    this.one[0]=i  ;this.two[0]=j-1;this.three[0]=0;
    this.one[1]=i-1;this.two[1]=j-1;this.three[1]=1;
    this.one[2]=i-1;this.two[2]=j;  this.three[2]=1;
    this.one[3]=i-1;this.two[3]=j+1;this.three[3]=1;
    }
    if(this.xingtai===1){
    this.rectyi.node.x=(j)*50;this.rectyi.node.y=(i+1)*50;
    this.recter.node.x=(j-1)*50;this.recter.node.y=(i+1)*50
    this.rectsan.node.x=(j-1)*50;this.rectsan.node.y=(i)*50;
    this.rectsi.node.x=(j-1)*50;this.rectsi.node.y=(i-1)*50; 
    this.jmix=j-1;this.jmax=j;  
    this.one[0]=i+1;this.two[0]=j  ;this.three[0]=1;
    this.one[1]=i+1;this.two[1]=j-1;this.three[1]=0;
    this.one[2]=i  ;this.two[2]=j-1;this.three[2]=0;
    this.one[3]=i-1;this.two[3]=j-1;this.three[3]=1;
    }
    if(this.xingtai===2){
    this.rectyi.node.x=(j+1)*50;this.rectyi.node.y=(i)*50;
    this.recter.node.x=(j+1)*50;this.recter.node.y=(i+1)*50
    this.rectsan.node.x=(j)*50;this.rectsan.node.y=(i+1)*50;
    this.rectsi.node.x=(j-1)*50;this.rectsi.node.y=(i+1)*50; 
    this.jmix=j-1;this.jmax=j+1;  
    this.one[0]=i;  this.two[0]=j+1;this.three[0]=1;
    this.one[1]=i+1;this.two[1]=j+1;this.three[1]=0; 
    this.one[2]=i+1;this.two[2]=j;  this.three[2]=1;
    this.one[3]=i+1;this.two[3]=j-1;this.three[3]=1;
    }
    if(this.xingtai===3){
    this.rectyi.node.x=(j+1)*50;this.rectyi.node.y=(i+1)*50;
    this.recter.node.x=(j+1)*50;this.recter.node.y=(i)*50
    this.rectsan.node.x=(j+1)*50;this.rectsan.node.y=(i-1)*50;
    this.rectsi.node.x=(j)*50;this.rectsi.node.y=(i-1)*50;
    this.jmix=j;this.jmax=j+1; 
    this.one[0]=i+1;this.two[0]=j+1;this.three[0]=0;
    this.one[1]=i;  this.two[1]=j+1;this.three[1]=0; 
    this.one[2]=i-1;this.two[2]=j+1;this.three[2]=1; 
    this.one[3]=i-1;this.two[3]=j;  this.three[3]=1; 
    }
    if(this.xingtai===3&&this.jmix===0){this.out=1};//出图的归位
    if(this.xingtai===1&&this.jmax===9){this.out=-1};//出图的归位
},
buildfive(){//五号
    //i=17;j=4
    var i=this.i;var j=this.j;
    if(this.xingtai===2){this.xingtai=0}
    if(this.xingtai===0){
    this.rectyi.node.x=j*50;this.rectyi.node.y=i*50;//第一个生成的方块
    this.recter.node.x=j*50;this.recter.node.y=(i+1)*50 //第二个
    this.rectsan.node.x=(j+1)*50;this.rectsan.node.y=(i-1)*50;
    this.rectsi.node.x=(j+1)*50;this.rectsi.node.y=(i)*50;
    this.jmix=j;this.jmax=j+1;
    this.one[0]=i;  this.two[0]=j;  this.three[0]=1;
    this.one[1]=i+1;this.two[1]=j;  this.three[1]=0;
    this.one[2]=i-1;this.two[2]=j+1;this.three[2]=1;
    this.one[3]=i;  this.two[3]=j+1;this.three[3]=0;
    }
    if(this.xingtai===1){
    this.rectyi.node.x=j*50;this.rectyi.node.y=i*50;
    this.recter.node.x=(j+1)*50;this.recter.node.y=(i)*50
    this.rectsan.node.x=(j)*50;this.rectsan.node.y=(i-1)*50;
    this.rectsi.node.x=(j-1)*50;this.rectsi.node.y=(i-1)*50;
    this.jmix=j-1;this.jmax=j+1;
    this.one[0]=i;  this.two[0]=j;  this.three[0]=0;
    this.one[1]=i;  this.two[1]=j+1;this.three[1]=0;
    this.one[2]=i-1;this.two[2]=j;  this.three[2]=1;
    this.one[3]=i-1;this.two[3]=j-1;this.three[3]=1;
}
    if(this.xingtai===0&&this.jmix===0){this.out=1};//出图的归位
},
buildsix(){//六号
    var i=this.i;var j=this.j;
    if(this.xingtai===2){this.xingtai=0}
    if(this.xingtai===0){
    this.rectyi.node.x=j*50;this.rectyi.node.y=(i+1)*50;
    this.recter.node.x=j*50;this.recter.node.y=(i)*50
    this.rectsan.node.x=(j)*50;this.rectsan.node.y=(i-1)*50;
    this.rectsi.node.x=(j)*50;this.rectsi.node.y=(i-2)*50;
    this.jmix=j;this.jmax=j;
    this.one[0]=i+1;this.two[0]=j;this.three[0]=0;
    this.one[1]=i;  this.two[1]=j;this.three[1]=0;
    this.one[2]=i-1;this.two[2]=j;this.three[2]=0;
    this.one[3]=i-2;this.two[3]=j;this.three[3]=1;
    }
    if(this.xingtai===1){
    this.rectyi.node.x=j*50;this.rectyi.node.y=i*50;
    this.recter.node.x=(j-1)*50;this.recter.node.y=(i)*50
    this.rectsan.node.x=(j+1)*50;this.rectsan.node.y=(i)*50;
    this.rectsi.node.x=(j-2)*50;this.rectsi.node.y=(i)*50;
    this.jmix=j-2;this.jmax=j+1;
    this.one[0]=i;this.two[0]=j;  this.three[0]=1;
    this.one[1]=i;this.two[1]=j-1;this.three[1]=1;
    this.one[2]=i;this.two[2]=j+1;this.three[2]=1;
    this.one[3]=i;this.two[3]=j-2;this.three[3]=1;
    }
    if(this.xingtai===0&&this.jmax===9){this.out=-1};//出图的归位
    if(this.xingtai===0&&this.jmix===1){this.out=1};//出图的归位
    if(this.xingtai===0&&this.jmix===0){this.out=2};//出图的归位
},
buildseven(){//七号
    var i=this.i;var j=this.j;
    if(this.xingtai===4){this.xingtai=0}
    if(this.xingtai===0){
    this.rectyi.node.x=j*50;this.rectyi.node.y=i*50;
    this.recter.node.x=(j-1)*50;this.recter.node.y=(i)*50
    this.rectsan.node.x=(j+1)*50;this.rectsan.node.y=(i)*50;
    this.rectsi.node.x=(j)*50;this.rectsi.node.y=(i+1)*50;
    this.jmix=j-1;this.jmax=j+1;
    this.one[0]=i;  this.two[0]=j;  this.three[0]=1;
    this.one[1]=i;  this.two[1]=j-1;this.three[1]=1;
    this.one[2]=i;  this.two[2]=j+1;this.three[2]=1;
    this.one[3]=i+1;this.two[3]=j;  this.three[3]=0;
    }
    if(this.xingtai===1){
    this.rectyi.node.x=j*50;this.rectyi.node.y=i*50;
    this.recter.node.x=(j+1)*50;this.recter.node.y=(i)*50;
    this.rectsan.node.x=(j)*50;this.rectsan.node.y=(i-1)*50;
    this.rectsi.node.x=(j)*50;this.rectsi.node.y=(i+1)*50;
    this.jmix=j;  this.jmax=j+1;
    this.one[0]=i;  this.two[0]=j;  this.three[0]=0;
    this.one[1]=i;  this.two[1]=j+1;this.three[1]=1;
    this.one[2]=i-1;this.two[2]=j;  this.three[2]=1;
    this.one[3]=i+1;this.two[3]=j;  this.three[3]=0;
    }
    if(this.xingtai===2){
    this.rectyi.node.x=j*50;this.rectyi.node.y=i*50;
    this.recter.node.x=(j+1)*50;this.recter.node.y=(i)*50;
    this.rectsan.node.x=(j-1)*50;this.rectsan.node.y=(i)*50;
    this.rectsi.node.x=(j)*50;this.rectsi.node.y=(i-1)*50;
    this.jmix=j-1;this.jmax=j+1;
    this.one[0]=i;  this.two[0]=j;  this.three[0]=0;
    this.one[1]=i;  this.two[1]=j+1;this.three[1]=1;
    this.one[2]=i;  this.two[2]=j-1;this.three[2]=1;
    this.one[3]=i-1;this.two[3]=j;  this.three[3]=1; 
    }
    if(this.xingtai===3){
    this.rectyi.node.x=j*50;this.rectyi.node.y=i*50;
    this.recter.node.x=(j)*50;this.recter.node.y=(i+1)*50;
    this.rectsan.node.x=(j-1)*50;this.rectsan.node.y=(i)*50;
    this.rectsi.node.x=(j)*50;this.rectsi.node.y=(i-1)*50;
    this.jmix=j-1;this.jmax=j;
    this.one[0]=i  ;this.two[0]=j;  this.three[0]=0;
    this.one[1]=i+1;this.two[1]=j;  this.three[1]=0;
    this.one[2]=i;  this.two[2]=j-1;this.three[2]=1;
    this.one[3]=i-1;this.two[3]=j;  this.three[3]=1;
    }
    if(this.xingtai===1&&this.jmix===0){this.out=1};//出图的归位
    if(this.xingtai===3&&this.jmax===9){this.out=-1};//出图的归位
},
_onTouchStart(index){
    cc.log(index);
    switch(index) {
        case 0:
            if(this.jmix>=1){
            this.sidemath();
            this.leftside();
            this.choose();
            }
            break;
        case 2:
        if(this.jmax<=8){
            this.sidemath();
            this.rightside();
            this.choose();
            }
            break;
        case 1: 
            this.j+=this.out;
            this.choose();
            var orixingtai=this.xingtai;
            cc.log('变换前的形态'+this.xingtai);
            this.xingtai++;
            this.choose();
            //检查有没有重合
            for(let i=0;i<4;i++){
        if(this.box[this.one[i]][this.two[i]]===1){
            cc.log('检查重合');
            this.xingtai=orixingtai;
            this.j-=this.out;
            this.choose();
            cc.log('返回前一步');
        }
}
            this.out=0;
            break;
    }
},
onKeyDown (event) {
        switch(event.keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
                if(this.jmix>=1){
                this.sidemath();
                this.leftside();
                this.choose();
                }
                break;
            case cc.KEY.d:
            case cc.KEY.right:
            if(this.jmax<=8){
                this.sidemath();
                this.rightside();
                this.choose();
                }
                break;
            case cc.KEY.w:
            case cc.KEY.up:
                this.j+=this.out;
                this.choose();
                var orixingtai=this.xingtai;
                cc.log('变换前的形态'+this.xingtai);
                this.xingtai++;
                this.choose();
                //检查有没有重合
                for(let i=0;i<4;i++){
            if(this.box[this.one[i]][this.two[i]]===1){
                cc.log('检查重合');
                this.xingtai=orixingtai;
                this.j-=this.out;
                this.choose();
                cc.log('返回前一步');
            }
    }
                this.out=0;
                break;
        }
    },
sidemath(){//除重：i
    var num=0;
    this.arry[0]=this.one[0];
    for(let i=1;i<4;i++){
        for(let j=0;j<this.arry.length;j++){
            if(this.arry[j]!==this.one[i]){
                num++
            if(num===this.arry.length){
            this.arry.push(this.one[i]);//后期有一个归0操作
                }
            }
        }
        num=0;
    }
},
leftside(){
        var num=0;
        var mix=100;
        for(let i=0;i<this.arry.length;i++){
            for(let j=0;j<4;j++){
                if(this.arry[i]===this.one[j]){
                    mix=Math.min(mix,this.two[j]);
                }
            }
            if(this.box[this.arry[i]][mix-1]!==1){
                    num++//成立才可以左移
                }
            mix=100;
         }
        if(this.arry.length===num){
            this.j--;
        }
        
},
rightside(){
        var num=0
        var max=-1;
        for(let i=0;i<this.arry.length;i++){
            for(let j=0;j<4;j++){
                if(this.arry[i]===this.one[j]){
                    max=Math.max(max,this.two[j]);
                }
            }
            if(this.box[this.arry[i]][max+1]!==1){
                num++
                //成立才可以右移
            }
            max=-1;
        }
         if(this.arry.length===num){
            this.j++;
        }
},
//ui
gameover(){
    for(let j=0;j<10;j++){
if(this.box[16][j]===1){
// cc.audioEngine.stopAll();
this.gamestate=0;
this.over.active=true;
this.gamestype();
setInterval(function(){
    cc.director.loadScene('start');
},6000);
        }
    }
},
regame(){
cc.director.loadScene("russsia");
},
addscore(){
    this.scorenum+=100;
    this.score.string=this.scorenum;
},
drawnext(){
    this.nextgoal=Math.floor(7*Math.random());
    var next=cc.find('Canvas/kuang1/shownext/next').getComponent('shownext');
    next.init(this.nextgoal);
},
gamestype(){
    if(this.gamestate===1){
            var self = this;
            cc.loader.loadRes('play',cc.SpriteFrame,function(err, spriteFrame){
                self.button.getComponent(cc.Sprite).spriteFrame = spriteFrame;
             });
             self.gamestate=0;
             self.schedule(self.down,self.speed);//速度
   }else if(this.gamestate===0){
            var self = this;
            cc.loader.loadRes('stop',cc.SpriteFrame,function(err, spriteFrame){
                self.button.getComponent(cc.Sprite).spriteFrame = spriteFrame;
             });
             self.gamestate=1;
             self.unschedule(self.down);
    }
},
movespeed(){
this.speed=0.2+0.8*this.sliderv.progress;
},
});
