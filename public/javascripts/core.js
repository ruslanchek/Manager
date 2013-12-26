function test(){
    $.ajax({
        url: '/login',
        type: 'post',
        data: {username: 'test', password: '123'},
        dataType: 'json',
        success: function(data){
            console.log(data)
        }
    })
}


function test1(){
    $.ajax({
        url: '/logout',
        type: 'get',
        success: function(data){
            console.log(data)
        }
    })
}