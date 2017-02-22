$(function() {
  var socket = io.connect();

  //$ before variable names to indicate jQuery objects
  var $messageForm = $("#messageForm");
  var $message = $('#message');
  var $chat = $('#chat');
  var $userForm = $("#userForm");
  var $userFormArea = $("userFormArea");
  var $messageArea = $("#messageArea");
  var $userFormArea = $("#userFormArea");
  var $users = $('#users');
  var $username = $('#username');


  $messageForm.submit(function(e) {
    //prevent default prevents automatic refresh
    e.preventDefault();
    socket.emit('send message', $message.val());
    $message.val('');
  });

  $userForm.submit(function(e) {
    //prevent default prevents automatic refresh
    e.preventDefault();
    socket.emit('new user', $username.val(), function(data){
      if(data){
        $userFormArea.hide();
        $messageArea.show();
      }
    });
    $username.val('');
  });

  socket.on('new message', function(data){
      $chat.append('<div class="well"><strong>'+data.user+': </strong>'+data.msg+'</div>')
  });

  socket.on('get users', function(data){
    var html = '';
    //traverses through server side user list and appends to side box
    for(i = 0; i <data.length; i++){
      html += '<li class="list-group-item">'+data[i]+'</li>';
    }
    $users.html(html);
  });
});
