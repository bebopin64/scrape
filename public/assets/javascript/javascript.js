$.getJSON('/articles', function(data) {
  for (var i = 0; i<data.length; i++){
    $('#articles').append('<p data-id="' + data[i]._id + '"><span class="headline">Headline</span>: '+ data[i].title + '<br />'+ '<a href="' + data[i].link  + '"' + 'target="' + "_blank" +' " >' +  data[i].link + '</a>' + '</p>');
  }
});


$(document).on('click', 'p', function(){
  $('#notes').empty();
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .done(function( data ) {
      console.log(data);
      $('#notes').append('<h2>' + data.title + '</h2>');
      $('#notes').append('<input id="titleinput" name="title" >');
      $('#notes').append('<textarea id="bodyinput" name="body"></textarea>');
      $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');
      if(data.note){
        console.log(data.note);
      $('#notes').append('<button data-id="' + data.note._id + '" id="deletenote">Delete Note</button>');
        $('#titleinput').val(data.note.title);
        $('#bodyinput').val(data.note.body);
      }
    });
});

$(document).on('click', '#deletenote', function(){

  var thisId = $(this).attr('data-id');
  console.log(thisId);
  $.ajax({
    method: "POST",
    url: "/deletenote/" + thisId ,
    data: {
      title: $('#titleinput').val(),
      body: $('#bodyinput').val() 
}
  })
    .done(function() {
        $('#titleinput').val("");
        $('#bodyinput').val("");
    });

});

$(document).on('click', '#savenote', function(){
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $('#titleinput').val(), 
      body: $('#bodyinput').val() 
    }
  })
    .done(function( data ) {
      console.log(data);
        $('#titleinput').val("");
         $('#bodyinput').val("");
    });
});
