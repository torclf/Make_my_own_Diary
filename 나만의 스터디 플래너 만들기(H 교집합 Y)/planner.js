

$(function() {
// inTagBox는 그 오른쪽에서 왼쪽으로 드래그해 갈 녀석을 말합니다. 즉 이미 A4 위에 놓여있는 애들은 포함하지 않아요. 암튼 이 드래거블2들을 드래그 가능하게 만들되, 이상한 데 가면 제자리로 돌아오게 하는 기능을 더함.(revert)
$( ".inTagBox" ).draggable({
  revert: "invalid",
  helper: "clone"
});


// droppable은 A4용지. 용지 위에 드래거블 애들을 드롭할 수 있게 만드는 코드
$( ".droppable_mainBox" ).droppable({
  tolerance: 'fit', //테두리 안에 완전히 들어와야 drop으로 인식
  classes: { // 그냥 뭔가 이벤트 같은데
    "ui-droppable-active": "ui-state-active",
    "ui-droppable-hover": "ui-state-hover"
  },
  drop: function( event, ui ) { // 드롭했을 때 실행할 함수: 드래그하는 대상을 복제해서 복제한 걸 드롭하는 코드

      // 복제해야 하는 오브젝트인가? 아니라면 -1을 반환함
      var isCopieable = $.inArray('inTagBox', ui.draggable.prop('classList'));
      //console.log($.inArray('inTagBox', ui.draggable.prop('classList')));
      if(isCopieable == -1) return 0;


      // 드래그하는 대상을 복제하고 클래스 넣기
      var newClone = $(ui.helper).clone();
      newClone.removeClass('inTagBox').addClass('draggable');



      if($.inArray('memo', newClone.prop('classList')) != -1)
      {
        var child = $(newClone).children('div');
        child.addClass('resizable');
      }
      else if ($.inArray('plan', newClone.prop('classList')) != -1) {
        var child = $(newClone).children('table');
        child.addClass('resizable');
      }
      else if ($.inArray('reflection', newClone.prop('classList')) != -1) {
        var child = $(newClone).children('table');
        child.addClass('resizable');
      }
      else if ($.inArray('time-table', newClone.prop('classList')) != -1) {
        var child = $(newClone).children('table');
        child.addClass('resizable');
      }
      else newClone.addClass('resizable');


      $(this).after(newClone);

      $(".resizable").resizable();

      $(".draggable").draggable({
        revert: 'invalid'
      });




    }
});


// droppable_tagBox는 원래 요소들 있던 표! 여기로 안착하면 삭제!
$(".droppable_tagBox").droppable({
  drop: function(event, ui) {
    var isCopieable = $.inArray('inTagBox', ui.draggable.prop('classList'));
    if(isCopieable !== -1) return 0;
    $(ui.draggable).remove();
  }
});

// 마우스 올리면 예시 이미지 띄우기
$("#hover").hover(function() {
  $("#example").show();
}, function() {
  $("#example").hide();
});

});


// 표에서 버튼 누르면 행 추가하는 거
function addColumn(btn) {
  var btnName = btn.name;
  var table = document.querySelectorAll(btnName)[document.querySelectorAll(btnName).length - 1];
  var column;
  if(btnName == '#planTable')
    column = document.querySelector('#column');
  else if(btnName == '#reflectionTable')
    column = document.querySelector('#column2');
  var newColumn = column.cloneNode(true);
  table.appendChild(newColumn);
}

// 표에서 버튼 누르면 행 삭제하는 거
function removeColumn(btn) {
  var btnName = btn.name;
  var table = document.querySelectorAll(btnName)[document.querySelectorAll(btnName).length - 1];
  var lastColumn = table.lastChild;
  //console.log(table.children);
  if(table.children.length <=3) return 0;
  table.removeChild(lastColumn);
}
        
      

function getElementList() {
  let elementList = Array();

  const c = document.getElementById("mainBox").children;
  children = [];

  for(i=0; i<c.length; i++) {
    if(c[i].tagName == 'TD')
      children.push(c[i]);
  }

  for(i = 0; i < children.length; i++) {
    const child = children[i]; //현재 선택한 자식

    for(k = 0; k < classList.length; k++) {
      const currentClass = classList[k]; // 클래스 목록에서 한 놈 고른 거

      if(child.className.includes(currentClass)) { // 현재 선택한 자식의 클래스들 중 클래스 목록과 겹치는 걸 찾읍시다
        
        //뉴리스트는 현재 선택한 엘리먼트의 클래스 이름, 크기 등의 정보를 담은 배열입니다
        let newList = Array();
        newList.push(currentClass);
        let width;
        let height;

        let childObject;
        //그 가로 세로 길이 따와야 하는 친구를 childObject로 정하기.

        switch(currentClass) {
          case('plan'):
             childObject = $(child).children('table')[0];
            break;

          case('reflection'):
             //자식 중에서 table인가 찾아서 그 녀석 크기 넣으면 되는데 너무 귀찮당
             childObject = $(child).children('table')[0];

            break;

          case('time-table'):
             //자식 중에서 img 태그인가 그 녀석 크기 넣으면 되는데 너무 귀찮당
             childObject = $(child).children('table')[0];

            break;

          case('memo'):
             //자식 중에서 div였나 찾아서 그 녀석 크기 넣으면 되는데 너무 귀찮당
             childObject = $(child).children('div')[0];

            break;

          default:
            childObject = $(child);

        }

        $(childObject).css('margin', 0);

        width = $(childObject).css('width');
        height = $(childObject).css('height');

        if(!width) width = childObject.offsetWidth.toString() + 'px';
        if(!height) height = childObject.offsetHeight.toString() + 'px';

        $(childObject).css('margin', '10px 10px 0 0');

        newList.push(width, height);

        // 뉴리스트에 들어가는 거: 클래스명, 가로, 세로, left, top, 행(또는 이름)

        //console.log('if cleared '+classList[k]);
        newList.push(child.style.left, child.style.top);
        if(currentClass == 'plan' || currentClass == 'reflection')
          newList.push(document.getElementById('planTable').children.length);

        if(currentClass == 'anything')
          newList.push(child.innerText);

        newList.push('/');
        elementList.push(newList);

      }


    }
    // 임시로 array를 만들어서 정보들 다 넣고 그걸 elementList에 넣어야 함.

    // elementList 보면 대충 클래스명, 크기, 위치, (행 개수)가 담긴 배열이 나올 거임


  }

  elementList.push(document.querySelector("#colorPicker").value);


          // 표 들어있는 거랑 타임테이블이랑 메모는 크기 따로 구해줘야 됨....(귀찮음..)


          //아 다차원 배열 뭔 말이죠 아ㅏ아ㅏ아ㅏ 심지어 for문은 3ㅐㄱ야ㅏ앙




        //console.log(children[0].className, children[0].style.width, children[0].style.height, children[0].style.left, children[0].style.top);

        // className, width, height, left, top, (column)
        /*
        클래스 이름이랑 클래스 리스트랑 대조해서 일치하는 걸 뽑아내야 함.

        */

  return elementList;
}

function watchColorPicker(event) {
  document.querySelector("#mainBox").style.backgroundColor = event.target.value;
}

        
// 이거 그 저장할 파일의 내용

const classList = ['studyTime', 'phrase', 'date', 'sticker', 'plan', 'reflection', 'time-table', 'memo', 'd-day', 'anything'];
let children = []; //a4지 위에 배치한 친구들을 찾습니다


let eleList;
let newCloneList;

// 윈도우가 로드되면  이거 하기!
window.onload = function() {


  
  document.querySelector("#colorPicker").addEventListener("change", watchColorPicker, false);

  document.querySelector('#savePDF').addEventListener('click', function(event){

    const title = prompt("파일의 이름을 입력하세요.");
    if(!title || title == "") title = "plannerPDF"; 

    //getElementList();

    html2canvas(document.querySelector("#mainBox"), {
        scale: 4,
        onrendered: function(canvas) {
        	alert("wh")

           var imgData = canvas.toDataURL('image/png', 1.0);
           //console.log('Report Image URL: '+imgData);
           var doc = new jsPDF('landscape', 'mm', 'a4'); //210mm wide and 297mm high

           doc.addImage(imgData, 'PNG', 0, 0);
           doc.addImage(imgData, 'PNG', 148.5, 0);
           doc.save(title + '.pdf');
       }
    });

  });



    /*

    
    var scaleBy = 5;
    var w = 1000;
    var h = 1000;
    var div = document.querySelector('#mainBox');
    var canvas = document.createElement('canvas');
    canvas.width = w * scaleBy;
    canvas.height = h * scaleBy;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    var context = canvas.getContext('2d');
    context.scale(scaleBy, scaleBy);

    html2canvas(div, {
      canvas:canvas,
      onrendered: function (canvas) {
        theCanvas = canvas;
        document.body.appendChild(canvas);

        var imgData = canvas.toDataURL('image/png', 1.0);
        var doc = new jsPDF('landscape', 'mm', 'a4'); //210mm wide and 297mm high
        doc.addImage(imgData, 'PNG', 0, 0);
        doc.addImage(imgData, 'PNG', 148.5, 0);
        doc.save(title + '.pdf');

        //Canvas2Image.saveAsPNG(canvas);
        //$('body').append(imgData);
      }
    });
    */

  document.querySelector('#saveTxt').addEventListener('click', function(event){

    const title = prompt("파일의 이름을 입력하세요.");
    if(!title) title = "plannerSave";

    var elementList = getElementList();

    var blob = new Blob([elementList], {
      type: "text/plain;charset=utf-8"
    });

    saveAs(blob, title+".txt");
         
  });

  document.querySelector('#upload').addEventListener('change', read);

  function read() {

    var files = this.files;
    if (files.length === 0) {
      console.log('No file is selected');
      return;
    }

    var reader = new FileReader();
    reader.readAsText(files[0]);

    reader.onload = function(event) {
      //console.log('File content:', event.target.result);

      const mainBox = document.querySelector("#mainBox");

      $(mainBox).children('td').remove();


      eleList = event.target.result.split(',/,');

      for(i=0; i<eleList.length; i++) {
        eleList[i] = eleList[i].split(',');
      }

      const bgColor = eleList.pop();
      document.querySelector("#colorPicker").value = bgColor;
      document.querySelector("#mainBox").style.backgroundColor = bgColor;
      if(eleList.length === 0) return false;

      if(eleList[eleList.length - 1].indexOf('/') != -1) 
        eleList[eleList.length - 1].splice(eleList[eleList.length - 1].indexOf('/'));

      newCloneList = Array(eleList.length);

      for(i=0; i<eleList.length; i++) {
        newCloneList[i] = document.getElementsByClassName(eleList[i][0])[0].cloneNode(true);

        newCloneList[i].style.position = "absolute";

        $(newCloneList[i]).addClass("draggable");
        $(newCloneList[i]).removeClass("inTagBox");

        switch(eleList[i][0]) {
          case("plan"):
            $(newCloneList[i]).children("table").css('width',eleList[i][1]);
            $(newCloneList[i]).children("table").css('height',eleList[i][2]);
            $(newCloneList[i]).children("table").addClass("resizable");
            break;
          case("reflection"):
            $(newCloneList[i]).children("table").css('width',eleList[i][1]);
            $(newCloneList[i]).children("table").css('height',eleList[i][2]);
            $(newCloneList[i]).children("table").addClass("resizable");
            break;
          case("memo"):
            $(newCloneList[i]).children("div").css('width',eleList[i][1]);
            $(newCloneList[i]).children("div").css('height',eleList[i][2]);
            $(newCloneList[i]).children("div").addClass("resizable");
            break;
          case("time-table"):
            $(newCloneList[i]).children("table").css('width',eleList[i][1]);
            $(newCloneList[i]).children("table").css('height',eleList[i][2]);
            $(newCloneList[i]).children("table").addClass("resizable");
            break;
          default:
            $(newCloneList[i]).css('width',eleList[i][1]);
            $(newCloneList[i]).css('height',eleList[i][2]);
            $(newCloneList[i]).addClass("resizable");
        }

        newCloneList[i].style.left = eleList[i][3];
        newCloneList[i].style.top = eleList[i][4];

        if(eleList[i][5]) {
          switch(eleList[i][0]) {
            case("plan"):
              for(j=0; j<eleList[i][5]-3; j++) {
                const columnClone = document.querySelector('#column').cloneNode(true);
                $(newCloneList[i]).find('tbody').append(columnClone);
              }
              break;

            case("reflection"):
              for(j=0; j<eleList[i][5]-3; j++) {
                const columnClone = document.querySelector('#column2').cloneNode(true);
                $(newCloneList[i]).find('tbody').append(columnClone);
              }
              break;

            case("anything"):
              newCloneList[i].innerHTML = eleList[i][5];
              break;
          }
        }
                  
      }

      for(i=0; i<newCloneList.length; i++) {
          document.querySelector("#mainBox").appendChild(newCloneList[i]);
      }

      $(".draggable").draggable({
        revert: "invalid"
      });

      $(".resizable").resizable();


    };

    var input = this;
    //console.log(this);

    if(!/safari/i.test(navigator.userAgent)){
      input.type = '';
      input.type = 'file';
    }

            
  }

  document.querySelector('#addNewTag').addEventListener('click', function() {
          
    var value = prompt('기능의 내용을 입력하세요.')
    if(value == "" || value == null) return 0;
    var newClone = document.querySelector('#anything').cloneNode(true);

    newClone.style.display = "";
    newClone.children[0].innerHTML = value;
    document.querySelector('#tagBox').children[1].appendChild(newClone);

    $( ".inTagBox" ).draggable({
    revert: "invalid",
    helper: "clone"
    });

    alert("하단에 추가되었습니다.");

  });

  document.querySelector('#video').addEventListener('click', function() {
    window.open("https://youtu.be/s_Gw9Y71V7k", "_blank");
  });


         

}



      // 나중에 파일화 하는 과정에서 이건 js 파일로 빼야 함
