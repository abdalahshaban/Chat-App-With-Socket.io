// alert('1')
$(function () {
    let messages = [];
    let socket = io.connect('http://localhost:3000');
    let chatForm = $('#chatForm');
    let message = $('#chatInput');
    let chatWindow = $('#chatWindow');
    let userForm = $('#UserForm');
    let username = $('#username');
    let users = $('#users');
    let error = $('#error');

    ///submit user Form
    userForm.on('submit', function (e) {
        socket.emit('set user', username.val(), (data) => {
            if (data) {
                $('#userFormWrap').hide();
                $('#mainWrap').show();
            } else {
                error.html('USer name is taken')
            }
        });
        e.preventDefault()
    });

    //submitt chat

    chatForm.on('submit', (e) => {
        socket.emit('send message', message.val());
        message.val('')
        e.preventDefault();
    })

    //show message
    socket.on('show message', (data) => {
        chatWindow.append('<h3>' + data.user + '</h3>:' + data.msg + '<br>');
    })

    //display usernams
    socket.on('users', (data) => {
        let html = '';
        console.log(data)
        for (let i = 0; i < data.length; i++) {
            html += '<li class="list-group-item">' + data[i] + '</li>'

        }
        console.log(html)
        users.html(html)
    });

});