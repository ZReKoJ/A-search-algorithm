'use strict'

$(() => {
    let converter = new showdown.Converter();
    $.ajax({
        url: '../README.md',
        dataType: 'text',
        success: function (data) {
            $('.main').append($(
                converter.makeHtml(data)
            ));
        }
    });
});